// bKash Payment Integration Module
class BkashPaymentGateway {
  constructor() {
    this.merchantNumber = '01924206385';
    this.baseURL = 'https://checkout.pay.bka.sh/v1.2.0-beta';
    this.isTestMode = true; // Set to false for production
    this.paymentID = null;
    this.isPaymentInProgress = false;
  }

  // Initialize bKash payment
  async initializePayment(amount, orderID, customerMobile) {
    if (this.isPaymentInProgress) {
      throw new Error('Payment already in progress');
    }

    this.isPaymentInProgress = true;

    try {
      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!this.isValidMobileNumber(customerMobile)) {
        throw new Error('Invalid mobile number format');
      }

      // Create payment request
      const paymentData = {
        amount: amount,
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderID,
        merchantAssociationInfo: this.merchantNumber,
        customerMsisdn: customerMobile,
        callbackURL: window.location.origin + '/payment-callback',
        mode: this.isTestMode ? '0000' : '0011' // Test mode vs Live mode
      };

      // Simulate bKash API call for demo purposes
      const response = await this.simulateBkashAPI('/create', paymentData);
      
      if (response.statusCode === '0000') {
        this.paymentID = response.paymentID;
        return {
          success: true,
          paymentID: response.paymentID,
          bkashURL: response.bkashURL,
          amount: amount,
          currency: 'BDT'
        };
      } else {
        throw new Error(response.statusMessage || 'Payment initialization failed');
      }

    } catch (error) {
      this.isPaymentInProgress = false;
      throw error;
    }
  }

  // Execute payment
  async executePayment(paymentID) {
    try {
      if (!paymentID) {
        throw new Error('Payment ID is required');
      }

      const executeData = {
        paymentID: paymentID
      };

      const response = await this.simulateBkashAPI('/execute', executeData);

      if (response.statusCode === '0000') {
        this.isPaymentInProgress = false;
        return {
          success: true,
          paymentID: response.paymentID,
          trxID: response.trxID,
          transactionStatus: response.transactionStatus,
          amount: response.amount,
          currency: response.currency,
          customerMsisdn: response.customerMsisdn,
          merchantInvoiceNumber: response.merchantInvoiceNumber
        };
      } else {
        throw new Error(response.statusMessage || 'Payment execution failed');
      }

    } catch (error) {
      this.isPaymentInProgress = false;
      throw error;
    }
  }

  // Query payment status
  async queryPayment(paymentID) {
    try {
      const queryData = {
        paymentID: paymentID
      };

      const response = await this.simulateBkashAPI('/query', queryData);
      
      return {
        success: response.statusCode === '0000',
        paymentID: response.paymentID,
        trxID: response.trxID,
        transactionStatus: response.transactionStatus,
        amount: response.amount,
        currency: response.currency
      };

    } catch (error) {
      console.error('Payment query failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Simulate bKash API for demo purposes
  async simulateBkashAPI(endpoint, data) {
    // Simulate network delay
    await this.delay(2000 + Math.random() * 2000);

    // Simulate different responses based on endpoint
    switch (endpoint) {
      case '/create':
        return {
          statusCode: '0000',
          statusMessage: 'Successful',
          paymentID: 'TR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
          bkashURL: 'https://checkout.pay.bka.sh/payment/TR' + Date.now(),
          callbackURL: data.callbackURL,
          successCallbackURL: data.callbackURL + '?status=success',
          failureCallbackURL: data.callbackURL + '?status=failure',
          cancelledCallbackURL: data.callbackURL + '?status=cancelled',
          amount: data.amount,
          currency: data.currency,
          intent: data.intent,
          merchantInvoiceNumber: data.merchantInvoiceNumber
        };

      case '/execute':
        // Simulate 90% success rate
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          return {
            statusCode: '0000',
            statusMessage: 'Successful',
            paymentID: data.paymentID,
            trxID: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
            transactionStatus: 'Completed',
            amount: '299.00',
            currency: 'BDT',
            customerMsisdn: '01XXXXXXXXX',
            merchantInvoiceNumber: 'INV' + Date.now(),
            paymentExecuteTime: new Date().toISOString(),
            merchantAssociationInfo: this.merchantNumber
          };
        } else {
          return {
            statusCode: '2001',
            statusMessage: 'Insufficient Balance',
            paymentID: data.paymentID
          };
        }

      case '/query':
        return {
          statusCode: '0000',
          statusMessage: 'Successful',
          paymentID: data.paymentID,
          trxID: 'TXN' + Date.now(),
          transactionStatus: 'Completed',
          amount: '299.00',
          currency: 'BDT',
          customerMsisdn: '01XXXXXXXXX'
        };

      default:
        throw new Error('Unknown API endpoint');
    }
  }

  // Validate Bangladeshi mobile number
  isValidMobileNumber(mobile) {
    // Bangladesh mobile number format: 01XXXXXXXXX (11 digits)
    const bdMobileRegex = /^01[3-9]\d{8}$/;
    return bdMobileRegex.test(mobile);
  }

  // Format mobile number
  formatMobileNumber(mobile) {
    // Remove any non-digit characters
    const cleaned = mobile.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.length === 11 && cleaned.startsWith('01')) {
      return '+880' + cleaned.substring(1);
    } else if (cleaned.length === 10 && !cleaned.startsWith('0')) {
      return '+880' + cleaned;
    } else if (cleaned.length === 13 && cleaned.startsWith('880')) {
      return '+' + cleaned;
    }
    
    return mobile; // Return as-is if format is unclear
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reset payment state
  resetPayment() {
    this.paymentID = null;
    this.isPaymentInProgress = false;
  }
}

// Export for use in main application
window.BkashPaymentGateway = BkashPaymentGateway;