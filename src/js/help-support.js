// Help & Support Module
class HelpSupportManager {
  constructor(app) {
    this.app = app;
    this.supportEmail = 'ayounus358cc@gmail.com';
    this.supportName = 'Younus Ali';
    this.supportLocation = 'বাংলাদেশ';
    this.serviceType = 'Free VPN App Developer & Support Provider';
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Help & Support button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.help-support-btn') || 
          e.target.closest('#help-support-btn') ||
          e.target.closest('[data-action="help-support"]')) {
        e.preventDefault();
        this.showHelpSupportModal();
      }
    });

    // Modal events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.close-help-modal')) {
        this.closeHelpModal();
      }
      
      if (e.target.closest('.send-support-email-btn')) {
        this.sendSupportEmail();
      }
      
      if (e.target.closest('.help-modal-overlay')) {
        this.closeHelpModal();
      }
    });

    // FAQ item toggles
    document.addEventListener('click', (e) => {
      if (e.target.closest('.faq-item-header')) {
        this.toggleFAQItem(e.target.closest('.faq-item'));
      }
    });
  }

  showHelpSupportModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('help-support-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modalHTML = `
      <div id="help-support-modal" class="help-modal-overlay">
        <div class="help-modal-content">
          <div class="help-modal-header">
            <h3><i class="fas fa-headset"></i> 🆘 সাহায্য ও সাপোর্ট</h3>
            <button class="close-help-modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="help-modal-body">
            <!-- Welcome Message -->
            <div class="help-welcome">
              <div class="support-avatar">
                <i class="fas fa-user-tie"></i>
              </div>
              <h4>আপনার যেকোনো প্রশ্ন, সমস্যা বা পরামর্শের জন্য আমরা সবসময় পাশে আছি।</h4>
              <p>আপনি যদি অ্যাপ ব্যবহারের সময় কোনো সমস্যায় পড়েন, অথবা নতুন কোনো ফিচার চান, আমাদের সাথে যোগাযোগ করুন:</p>
            </div>

            <!-- Contact Information -->
            <div class="contact-section">
              <h4><i class="fas fa-envelope"></i> যোগাযোগের ঠিকানা:</h4>
              <div class="contact-details">
                <div class="contact-item">
                  <span class="contact-label">ইমেইল:</span>
                  <span class="contact-value">${this.supportEmail}</span>
                  <button class="copy-email-btn" data-email="${this.supportEmail}">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                <div class="contact-item">
                  <span class="contact-label">নাম:</span>
                  <span class="contact-value">${this.supportName}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">ঠিকানা:</span>
                  <span class="contact-value">${this.supportLocation}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">সার্ভিস টাইপ:</span>
                  <span class="contact-value">${this.serviceType}</span>
                </div>
              </div>
            </div>

            <!-- Support Categories -->
            <div class="support-categories">
              <h4><i class="fas fa-tools"></i> আমরা কী ধরনের সাহায্য করি:</h4>
              <div class="categories-grid">
                <div class="category-item">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>অ্যাকাউন্ট লগইন সমস্যা</span>
                </div>
                <div class="category-item">
                  <i class="fas fa-wifi"></i>
                  <span>VPN কানেক্ট না হওয়া</span>
                </div>
                <div class="category-item">
                  <i class="fas fa-crown"></i>
                  <span>পেইড সার্ভার/সাবস্ক্রিপশন সমস্যা</span>
                </div>
                <div class="category-item">
                  <i class="fas fa-tachometer-alt"></i>
                  <span>স্পিড টেস্টিং ও সার্ভার পছন্দ</span>
                </div>
                <div class="category-item">
                  <i class="fas fa-plus-circle"></i>
                  <span>নতুন ফিচার অনুরোধ</span>
                </div>
                <div class="category-item">
                  <i class="fas fa-bug"></i>
                  <span>বাগ রিপোর্ট / অ্যাপ ক্র্যাশ</span>
                </div>
              </div>
            </div>

            <!-- Emergency Support -->
            <div class="emergency-support">
              <h4><i class="fas fa-clock"></i> জরুরি সহায়তা:</h4>
              <p>আমাদের টিম চেষ্টা করে <strong>২৪ ঘণ্টার মধ্যে</strong> রেসপন্স দিতে। আপনার ইমেইলে বা ইন-অ্যাপ ফর্মের মাধ্যমে সাহায্য চাইতে পারেন।</p>
            </div>

            <!-- Quick Contact Form -->
            <div class="quick-contact-form">
              <h4><i class="fas fa-paper-plane"></i> দ্রুত যোগাযোগ:</h4>
              <form id="support-contact-form">
                <div class="form-group">
                  <label for="support-subject">সমস্যার ধরন:</label>
                  <select id="support-subject" required>
                    <option value="">সমস্যার ধরন নির্বাচন করুন</option>
                    <option value="login-issue">অ্যাকাউন্ট লগইন সমস্যা</option>
                    <option value="connection-issue">VPN কানেক্ট না হওয়া</option>
                    <option value="premium-issue">পেইড সার্ভার/সাবস্ক্রিপশন সমস্যা</option>
                    <option value="speed-issue">স্পিড টেস্টিং ও সার্ভার পছন্দ</option>
                    <option value="feature-request">নতুন ফিচার অনুরোধ</option>
                    <option value="bug-report">বাগ রিপোর্ট / অ্যাপ ক্র্যাশ</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="support-message">আপনার সমস্যা বিস্তারিত লিখুন:</label>
                  <textarea id="support-message" rows="4" placeholder="আপনার সমস্যা বা প্রশ্ন এখানে লিখুন..." required></textarea>
                </div>
                <div class="form-group">
                  <label for="support-user-email">আপনার ইমেইল:</label>
                  <input type="email" id="support-user-email" placeholder="আপনার ইমেইল ঠিকানা" value="${this.app.currentUser?.email || ''}" required>
                </div>
              </form>
            </div>

            <!-- FAQ Section -->
            <div class="faq-section">
              <h4><i class="fas fa-question-circle"></i> সাধারণ প্রশ্ন ও উত্তর:</h4>
              <div class="faq-list">
                ${this.generateFAQItems()}
              </div>
            </div>

            <!-- Footer Message -->
            <div class="help-footer">
              <div class="footer-message">
                <i class="fas fa-heart"></i>
                <p><strong>আপনি আছেন, আমরা পাশে আছি।</strong><br>
                ধন্যবাদ আমাদের "BD VPN Pro" অ্যাপ ব্যবহারের জন্য! 🇧🇩</p>
              </div>
            </div>
          </div>

          <div class="help-modal-footer">
            <button class="btn-secondary close-help-modal">বন্ধ করুন</button>
            <button class="btn-primary send-support-email-btn">
              <i class="fas fa-envelope"></i>
              ইমেইল পাঠান
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup copy email functionality
    this.setupCopyEmailButtons();
  }

  generateFAQItems() {
    const faqData = [
      {
        question: "VPN কানেক্ট হচ্ছে না, কী করব?",
        answer: "প্রথমে আপনার ইন্টারনেট কানেকশন চেক করুন। তারপর অন্য সার্ভার সিলেক্ট করে দেখুন। যদি সমস্যা থাকে, অ্যাপ বন্ধ করে আবার চালু করুন।"
      },
      {
        question: "প্রিমিয়াম সাবস্ক্রিপশন কিভাবে কিনব?",
        answer: "অ্যাপের 'Premium' ট্যাবে গিয়ে 'Upgrade Now' বাটনে ক্লিক করুন। bKash দিয়ে পেমেন্ট করতে পারবেন।"
      },
      {
        question: "কোন সার্ভার সবচেয়ে ভালো?",
        answer: "ঢাকার সার্ভারগুলো সবচেয়ে দ্রুত। প্রিমিয়াম সার্ভারগুলো আরও ভালো স্পিড দেয়।"
      },
      {
        question: "অ্যাকাউন্ট পাসওয়ার্ড ভুলে গেছি",
        answer: "লগইন পেজে 'Forgot Password?' লিংকে ক্লিক করুন। আপনার ইমেইলে রিসেট লিংক পাঠানো হবে।"
      },
      {
        question: "অ্যাপ ক্র্যাশ হচ্ছে",
        answer: "অ্যাপ আপডেট করুন। যদি সমস্যা থাকে, ডিভাইস রিস্টার্ট করুন। তারপরও সমস্যা হলে আমাদের জানান।"
      },
      {
        question: "ডেটা কত খরচ হয়?",
        answer: "VPN ব্যবহারে সামান্য অতিরিক্ত ডেটা খরচ হয়। সাধারণত ১০-১৫% বেশি ডেটা লাগে।"
      }
    ];

    return faqData.map((faq, index) => `
      <div class="faq-item">
        <div class="faq-item-header">
          <h5>${faq.question}</h5>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-item-content">
          <p>${faq.answer}</p>
        </div>
      </div>
    `).join('');
  }

  setupCopyEmailButtons() {
    document.querySelectorAll('.copy-email-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.target.closest('.copy-email-btn').dataset.email;
        this.copyToClipboard(email);
        this.app.showToast('ইমেইল কপি হয়েছে!', 'success');
      });
    });
  }

  toggleFAQItem(faqItem) {
    const content = faqItem.querySelector('.faq-item-content');
    const icon = faqItem.querySelector('.faq-item-header i');
    
    if (faqItem.classList.contains('active')) {
      faqItem.classList.remove('active');
      content.style.maxHeight = '0';
      icon.style.transform = 'rotate(0deg)';
    } else {
      // Close other FAQ items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-item-content').style.maxHeight = '0';
        item.querySelector('.faq-item-header i').style.transform = 'rotate(0deg)';
      });
      
      // Open clicked item
      faqItem.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.style.transform = 'rotate(180deg)';
    }
  }

  sendSupportEmail() {
    const subject = document.getElementById('support-subject').value;
    const message = document.getElementById('support-message').value;
    const userEmail = document.getElementById('support-user-email').value;

    if (!subject || !message || !userEmail) {
      this.app.showToast('সব ফিল্ড পূরণ করুন', 'error');
      return;
    }

    // Create email content
    const emailSubject = `BD VPN Pro Support: ${this.getSubjectText(subject)}`;
    const emailBody = `
সমস্যার ধরন: ${this.getSubjectText(subject)}
ব্যবহারকারীর ইমেইল: ${userEmail}
ব্যবহারকারীর নাম: ${this.app.currentUser?.name || 'অজানা'}
অ্যাকাউন্ট টাইপ: ${this.app.currentUser?.isPremium ? 'প্রিমিয়াম' : 'ফ্রি'}

সমস্যার বিবরণ:
${message}

---
এই ইমেইল BD VPN Pro অ্যাপ থেকে পাঠানো হয়েছে।
সময়: ${new Date().toLocaleString('bn-BD')}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:${this.supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    this.app.showToast('ইমেইল ক্লায়েন্ট খোলা হচ্ছে...', 'success');
    
    // Close modal after a delay
    setTimeout(() => {
      this.closeHelpModal();
    }, 2000);
  }

  getSubjectText(value) {
    const subjects = {
      'login-issue': 'অ্যাকাউন্ট লগইন সমস্যা',
      'connection-issue': 'VPN কানেক্ট না হওয়া',
      'premium-issue': 'পেইড সার্ভার/সাবস্ক্রিপশন সমস্যা',
      'speed-issue': 'স্পিড টেস্টিং ও সার্ভার পছন্দ',
      'feature-request': 'নতুন ফিচার অনুরোধ',
      'bug-report': 'বাগ রিপোর্ট / অ্যাপ ক্র্যাশ',
      'other': 'অন্যান্য'
    };
    return subjects[value] || value;
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  closeHelpModal() {
    const modal = document.getElementById('help-support-modal');
    if (modal) {
      modal.remove();
    }
  }

  // Add help button to profile section
  addHelpButton() {
    const profileActions = document.querySelector('.profile-actions');
    if (profileActions && !document.querySelector('.help-support-btn')) {
      const helpButton = document.createElement('button');
      helpButton.className = 'profile-btn help-support-btn';
      helpButton.innerHTML = `
        <i class="fas fa-headset"></i>
        🆘 সাহায্য ও সাপোর্ট
      `;
      
      // Insert before logout button
      const logoutBtn = profileActions.querySelector('.danger');
      if (logoutBtn) {
        profileActions.insertBefore(helpButton, logoutBtn);
      } else {
        profileActions.appendChild(helpButton);
      }
    }
  }
}

// Export for use in main application
window.HelpSupportManager = HelpSupportManager;