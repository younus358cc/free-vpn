// Premium Upgrade Module with bKash Integration
class PremiumUpgradeManager {
  constructor(app) {
    this.app = app;
    this.bkash = new BkashPaymentGateway();
    this.premiumPrice = 299; // BDT
    this.currentPaymentID = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Premium upgrade buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.upgrade-btn') || e.target.closest('.premium-upgrade-btn')) {
        e.preventDefault();
        this.showUpgradeModal();
      }
    });

    // Payment modal events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.close-modal')) {
        this.closeUpgradeModal();
      }
      
      if (e.target.closest('.proceed-payment-btn')) {
        this.processBkashPayment();
      }
      
      if (e.target.closest('.modal-overlay')) {
        this.closeUpgradeModal();
      }
    });

    // Mobile number input formatting
    document.addEventListener('input', (e) => {
      if (e.target.id === 'customer-mobile') {
        this.formatMobileInput(e.target);
      }
    });
  }

  showUpgradeModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('premium-upgrade-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modalHTML = `
      <div id="premium-upgrade-modal" class="modal-overlay">
        <div class="modal-content premium-modal">
          <div class="modal-header">
            <h3><i class="fas fa-crown"></i> Upgrade to Premium</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="premium-benefits">
              <h4>Premium Benefits</h4>
              <ul>
                <li><i class="fas fa-bolt"></i> 10x Faster Connection Speeds</li>
                <li><i class="fas fa-globe"></i> Access to Premium Servers</li>
                <li><i class="fas fa-shield-alt"></i> Enhanced Security Protocols</li>
                <li><i class="fas fa-headset"></i> 24/7 Priority Support</li>
                <li><i class="fas fa-ad"></i> Ad-Free Experience</li>
                <li><i class="fas fa-devices"></i> Unlimited Device Connections</li>
              </ul>
            </div>

            <div class="pricing-section">
              <div class="price-display">
                <span class="currency">৳</span>
                <span class="amount">${this.premiumPrice}</span>
                <span class="period">/month</span>
              </div>
              <p class="price-note">Billed monthly • Cancel anytime</p>
            </div>

            <div class="payment-section">
              <h4><i class="fab fa-bkash"></i> Pay with bKash</h4>
              <p class="payment-info">Secure payment powered by bKash</p>
              
              <div class="form-group">
                <label for="customer-mobile">Your bKash Mobile Number</label>
                <div class="input-group">
                  <i class="fas fa-mobile-alt"></i>
                  <input type="tel" id="customer-mobile" placeholder="01XXXXXXXXX" maxlength="11" required>
                </div>
                <small class="input-help">Enter your 11-digit mobile number</small>
              </div>

              <div class="bkash-info">
                <div class="merchant-info">
                  <span class="label">Merchant:</span>
                  <span class="value">BD VPN Pro</span>
                </div>
                <div class="amount-info">
                  <span class="label">Amount:</span>
                  <span class="value">৳${this.premiumPrice}.00</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary close-modal">Cancel</button>
            <button class="btn-primary proceed-payment-btn">
              <i class="fab fa-bkash"></i>
              Pay ৳${this.premiumPrice} with bKash
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Focus on mobile input
    setTimeout(() => {
      document.getElementById('customer-mobile').focus();
    }, 100);
  }

  closeUpgradeModal() {
    const modal = document.getElementById('premium-upgrade-modal');
    if (modal) {
      modal.remove();
    }
  }

  formatMobileInput(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Auto-add 01 prefix if user starts typing without it
    if (value.length > 0 && !value.startsWith('01')) {
      if (value.length === 1 && ['3', '4', '5', '6', '7', '8', '9'].includes(value[0])) {
        value = '01' + value;
      }
    }
    
    input.value = value;
    
    // Validate and show feedback
    const isValid = this.bkash.isValidMobileNumber(value);
    const inputGroup = input.closest('.input-group');
    
    if (value.length === 11) {
      if (isValid) {
        inputGroup.classList.remove('error');
        inputGroup.classList.add('success');
      } else {
        inputGroup.classList.remove('success');
        inputGroup.classList.add('error');
      }
    } else {
      inputGroup.classList.remove('success', 'error');
    }
  }

  async processBkashPayment() {
    const mobileInput = document.getElementById('customer-mobile');
    const mobile = mobileInput.value.trim();
    const proceedBtn = document.querySelector('.proceed-payment-btn');

    // Validate mobile number
    if (!this.bkash.isValidMobileNumber(mobile)) {
      this.app.showToast('Please enter a valid 11-digit mobile number', 'error');
      mobileInput.focus();
      return;
    }

    // Show loading state
    const originalBtnContent = proceedBtn.innerHTML;
    proceedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    proceedBtn.disabled = true;

    try {
      // Generate unique order ID
      const orderID = 'BDVPN' + Date.now();

      this.app.showToast('Initializing bKash payment...', 'warning');

      // Initialize payment
      const paymentInit = await this.bkash.initializePayment(
        this.premiumPrice,
        orderID,
        mobile
      );

      if (paymentInit.success) {
        this.currentPaymentID = paymentInit.paymentID;
        
        // Show payment confirmation modal
        this.showPaymentConfirmation(paymentInit, mobile);
      } else {
        throw new Error('Payment initialization failed');
      }

    } catch (error) {
      console.error('Payment initialization error:', error);
      this.app.showToast(`Payment failed: ${error.message}`, 'error');
      
      // Reset button
      proceedBtn.innerHTML = originalBtnContent;
      proceedBtn.disabled = false;
    }
  }

  showPaymentConfirmation(paymentData, mobile) {
    // Close upgrade modal
    this.closeUpgradeModal();

    const confirmationHTML = `
      <div id="payment-confirmation-modal" class="modal-overlay">
        <div class="modal-content payment-confirmation">
          <div class="modal-header">
            <h3><i class="fab fa-bkash"></i> bKash Payment</h3>
          </div>
          
          <div class="modal-body">
            <div class="payment-details">
              <div class="bkash-logo">
                <i class="fab fa-bkash"></i>
                <span>bKash</span>
              </div>
              
              <div class="payment-info">
                <div class="info-row">
                  <span class="label">Merchant:</span>
                  <span class="value">BD VPN Pro</span>
                </div>
                <div class="info-row">
                  <span class="label">Amount:</span>
                  <span class="value amount">৳${this.premiumPrice}.00</span>
                </div>
                <div class="info-row">
                  <span class="label">Mobile:</span>
                  <span class="value">${mobile}</span>
                </div>
                <div class="info-row">
                  <span class="label">Payment ID:</span>
                  <span class="value">${paymentData.paymentID}</span>
                </div>
              </div>

              <div class="payment-instructions">
                <h4>Payment Instructions:</h4>
                <ol>
                  <li>You will receive an SMS from bKash</li>
                  <li>Enter your bKash PIN to confirm</li>
                  <li>Wait for payment confirmation</li>
                </ol>
              </div>

              <div class="payment-status">
                <div class="status-indicator processing">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Waiting for payment confirmation...</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary cancel-payment-btn">Cancel Payment</button>
            <button class="btn-primary confirm-payment-btn">
              <i class="fas fa-check"></i>
              I've Completed Payment
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmationHTML);

    // Setup confirmation modal events
    this.setupConfirmationEvents();

    // Simulate SMS notification
    setTimeout(() => {
      this.app.showToast('SMS sent to ' + mobile + ' for payment confirmation', 'success');
    }, 2000);
  }

  setupConfirmationEvents() {
    const modal = document.getElementById('payment-confirmation-modal');
    
    // Cancel payment
    modal.querySelector('.cancel-payment-btn').addEventListener('click', () => {
      this.cancelPayment();
    });

    // Confirm payment
    modal.querySelector('.confirm-payment-btn').addEventListener('click', () => {
      this.executePayment();
    });
  }

  async executePayment() {
    const confirmBtn = document.querySelector('.confirm-payment-btn');
    const statusIndicator = document.querySelector('.status-indicator');

    // Show processing state
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    confirmBtn.disabled = true;

    statusIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Verifying payment...</span>';

    try {
      // Execute payment
      const result = await this.bkash.executePayment(this.currentPaymentID);

      if (result.success) {
        // Payment successful
        this.handlePaymentSuccess(result);
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (error) {
      console.error('Payment execution error:', error);
      this.handlePaymentFailure(error.message);
    }
  }

  handlePaymentSuccess(paymentResult) {
    const modal = document.getElementById('payment-confirmation-modal');
    
    // Update modal to show success
    modal.querySelector('.modal-body').innerHTML = `
      <div class="payment-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Payment Successful!</h3>
        <p>Your premium subscription has been activated</p>
        
        <div class="transaction-details">
          <div class="detail-row">
            <span class="label">Transaction ID:</span>
            <span class="value">${paymentResult.trxID}</span>
          </div>
          <div class="detail-row">
            <span class="label">Amount Paid:</span>
            <span class="value">৳${paymentResult.amount}</span>
          </div>
          <div class="detail-row">
            <span class="label">Payment Method:</span>
            <span class="value">bKash</span>
          </div>
        </div>

        <div class="premium-activated">
          <i class="fas fa-crown"></i>
          <span>Premium features are now active!</span>
        </div>
      </div>
    `;

    modal.querySelector('.modal-footer').innerHTML = `
      <button class="btn-primary close-success-btn">
        <i class="fas fa-rocket"></i>
        Explore Premium Features
      </button>
    `;

    // Setup close event
    modal.querySelector('.close-success-btn').addEventListener('click', () => {
      this.activatePremiumFeatures();
      modal.remove();
    });

    // Show success toast
    this.app.showToast('Premium subscription activated successfully!', 'success');

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.getElementById('payment-confirmation-modal')) {
        this.activatePremiumFeatures();
        modal.remove();
      }
    }, 5000);
  }

  handlePaymentFailure(errorMessage) {
    const modal = document.getElementById('payment-confirmation-modal');
    
    // Update modal to show failure
    modal.querySelector('.modal-body').innerHTML = `
      <div class="payment-failure">
        <div class="error-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h3>Payment Failed</h3>
        <p>${errorMessage}</p>
        
        <div class="failure-reasons">
          <h4>Common reasons for payment failure:</h4>
          <ul>
            <li>Insufficient balance in bKash account</li>
            <li>Incorrect PIN entered</li>
            <li>Network connectivity issues</li>
            <li>Payment timeout</li>
          </ul>
        </div>
      </div>
    `;

    modal.querySelector('.modal-footer').innerHTML = `
      <button class="btn-secondary close-failure-btn">Close</button>
      <button class="btn-primary retry-payment-btn">
        <i class="fas fa-redo"></i>
        Try Again
      </button>
    `;

    // Setup events
    modal.querySelector('.close-failure-btn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.retry-payment-btn').addEventListener('click', () => {
      modal.remove();
      this.showUpgradeModal();
    });

    // Show error toast
    this.app.showToast('Payment failed. Please try again.', 'error');

    // Reset payment state
    this.bkash.resetPayment();
    this.currentPaymentID = null;
  }

  cancelPayment() {
    const modal = document.getElementById('payment-confirmation-modal');
    if (modal) {
      modal.remove();
    }

    // Reset payment state
    this.bkash.resetPayment();
    this.currentPaymentID = null;

    this.app.showToast('Payment cancelled', 'warning');
  }

  activatePremiumFeatures() {
    // Update user to premium
    if (this.app.currentUser) {
      this.app.currentUser.isPremium = true;
      this.app.currentUser.premiumActivatedAt = new Date().toISOString();
      this.app.currentUser.premiumExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
      
      // Save updated user data
      localStorage.setItem('vpn_user', JSON.stringify(this.app.currentUser));
      
      // Update UI
      this.app.updateUI();
      
      // Switch to premium tab to show new features
      this.app.switchTab('premium');
      
      // Update premium tab content to show activated features
      this.updatePremiumTabContent();
    }
  }

  updatePremiumTabContent() {
    const premiumTab = document.getElementById('premium-tab');
    if (premiumTab) {
      premiumTab.innerHTML = `
        <div class="premium-activated-content">
          <div class="premium-header">
            <div class="premium-crown">
              <i class="fas fa-crown"></i>
            </div>
            <h2>Premium Activated!</h2>
            <p>Welcome to BD VPN Pro Premium</p>
          </div>

          <div class="premium-status">
            <div class="status-card">
              <h3>Your Premium Subscription</h3>
              <div class="status-details">
                <div class="status-item">
                  <span class="label">Status:</span>
                  <span class="value active">Active</span>
                </div>
                <div class="status-item">
                  <span class="label">Expires:</span>
                  <span class="value">${new Date(this.app.currentUser.premiumExpiryDate).toLocaleDateString()}</span>
                </div>
                <div class="status-item">
                  <span class="label">Plan:</span>
                  <span class="value">Monthly Premium</span>
                </div>
              </div>
            </div>
          </div>

          <div class="premium-features-active">
            <h3>Your Premium Features</h3>
            <div class="features-grid">
              <div class="feature-card active">
                <i class="fas fa-bolt"></i>
                <h4>Ultra-Fast Speeds</h4>
                <p>Up to 10x faster connection speeds</p>
                <span class="feature-status">✓ Active</span>
              </div>
              <div class="feature-card active">
                <i class="fas fa-globe"></i>
                <h4>Premium Servers</h4>
                <p>Access to exclusive high-performance servers</p>
                <span class="feature-status">✓ Active</span>
              </div>
              <div class="feature-card active">
                <i class="fas fa-shield-alt"></i>
                <h4>Enhanced Security</h4>
                <p>Advanced encryption and security protocols</p>
                <span class="feature-status">✓ Active</span>
              </div>
              <div class="feature-card active">
                <i class="fas fa-headset"></i>
                <h4>Priority Support</h4>
                <p>24/7 premium customer support</p>
                <span class="feature-status">✓ Active</span>
              </div>
            </div>
          </div>

          <div class="premium-actions">
            <button class="btn-primary explore-servers-btn">
              <i class="fas fa-server"></i>
              Explore Premium Servers
            </button>
            <button class="btn-secondary manage-subscription-btn">
              <i class="fas fa-cog"></i>
              Manage Subscription
            </button>
          </div>
        </div>
      `;

      // Setup premium action events
      premiumTab.querySelector('.explore-servers-btn').addEventListener('click', () => {
        this.app.switchTab('servers');
        this.app.switchServerTab('premium');
      });

      premiumTab.querySelector('.manage-subscription-btn').addEventListener('click', () => {
        this.showSubscriptionManagement();
      });
    }
  }

  showSubscriptionManagement() {
    // Implementation for subscription management
    this.app.showToast('Subscription management coming soon!', 'warning');
  }

  // Add prominent upgrade buttons throughout the app
  addUpgradeButtons() {
    // Add upgrade button to header for free users
    if (!this.app.currentUser?.isPremium) {
      const headerActions = document.querySelector('.header-actions');
      if (headerActions && !document.querySelector('.header-upgrade-btn')) {
        const upgradeBtn = document.createElement('button');
        upgradeBtn.className = 'header-upgrade-btn premium-upgrade-btn';
        upgradeBtn.innerHTML = '<i class="fas fa-crown"></i> Upgrade';
        headerActions.insertBefore(upgradeBtn, headerActions.firstChild);
      }
    }
  }
}

// Export for use in main application
window.PremiumUpgradeManager = PremiumUpgradeManager;