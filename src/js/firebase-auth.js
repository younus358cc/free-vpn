// Firebase Authentication Handler
class FirebaseAuthManager {
  constructor() {
    this.auth = window.firebaseAuth;
    this.currentUser = null;
    this.verificationCheckInterval = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthState();
    this.setupFormValidation();
  }

  setupEventListeners() {
    // Form submissions
    document.getElementById('registration-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignUp();
    });

    document.getElementById('login-form-element').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Navigation between forms
    document.getElementById('show-login').addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });

    document.getElementById('show-signup').addEventListener('click', (e) => {
      e.preventDefault();
      this.showSignUpForm();
    });

    // Password toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.togglePasswordVisibility(e.target.closest('.password-input'));
      });
    });

    // Verification actions
    document.getElementById('resend-verification').addEventListener('click', () => {
      this.resendVerificationEmail();
    });

    document.getElementById('check-verification').addEventListener('click', () => {
      this.checkEmailVerification();
    });

    document.getElementById('back-to-login').addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });

    // Success screen
    document.getElementById('continue-to-app').addEventListener('click', () => {
      this.redirectToApp();
    });

    // Real-time input validation
    document.getElementById('email').addEventListener('input', (e) => {
      this.validateEmail(e.target);
    });

    document.getElementById('password').addEventListener('input', (e) => {
      this.validatePassword(e.target);
    });

    document.getElementById('confirmPassword').addEventListener('input', (e) => {
      this.validateConfirmPassword(e.target);
    });

    document.getElementById('fullName').addEventListener('input', (e) => {
      this.validateFullName(e.target);
    });
  }

  setupFormValidation() {
    // Email validation for Gmail only
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateGmailAddress(input);
      });
    });
  }

  checkAuthState() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        console.log('User signed in:', user.email);
        
        if (user.emailVerified) {
          this.showSuccessScreen(user);
        } else {
          this.showVerificationScreen(user.email);
        }
      } else {
        this.currentUser = null;
        console.log('User signed out');
      }
    });
  }

  async handleSignUp() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    // Validation
    if (!this.validateSignUpForm(fullName, email, password, confirmPassword, acceptTerms)) {
      return;
    }

    const signUpBtn = document.getElementById('signup-btn');
    this.setButtonLoading(signUpBtn, true);
    this.showLoading('একাউন্ট তৈরি করা হচ্ছে...');

    try {
      // Create user account
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update user profile
      await user.updateProfile({
        displayName: fullName
      });

      // Send verification email
      await this.sendVerificationEmail(user);

      this.hideLoading();
      this.showToast('একাউন্ট সফলভাবে তৈরি হয়েছে! ইমেইল যাচাই করুন।', 'success');
      this.showVerificationScreen(email);

    } catch (error) {
      this.hideLoading();
      this.handleAuthError(error);
    } finally {
      this.setButtonLoading(signUpBtn, false);
    }
  }

  async handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!this.validateLoginForm(email, password)) {
      return;
    }

    const loginBtn = document.getElementById('login-btn');
    this.setButtonLoading(loginBtn, true);
    this.showLoading('লগইন করা হচ্ছে...');

    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      this.hideLoading();

      if (user.emailVerified) {
        this.showToast('সফলভাবে লগইন হয়েছে!', 'success');
        this.showSuccessScreen(user);
      } else {
        this.showToast('প্রথমে আপনার ইমেইল যাচাই করুন', 'warning');
        this.showVerificationScreen(email);
      }

    } catch (error) {
      this.hideLoading();
      this.handleAuthError(error);
    } finally {
      this.setButtonLoading(loginBtn, false);
    }
  }

  async sendVerificationEmail(user) {
    try {
      await user.sendEmailVerification({
        url: window.location.origin + '/firebase-auth.html',
        handleCodeInApp: false
      });
      
      console.log('Verification email sent to:', user.email);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      this.showToast('ইমেইল পাঠাতে সমস্যা হয়েছে', 'error');
      return false;
    }
  }

  async resendVerificationEmail() {
    if (!this.currentUser) {
      this.showToast('ব্যবহারকারী পাওয়া যায়নি', 'error');
      return;
    }

    const resendBtn = document.getElementById('resend-verification');
    const originalText = resendBtn.innerHTML;
    
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> পাঠানো হচ্ছে...';
    resendBtn.disabled = true;

    try {
      await this.sendVerificationEmail(this.currentUser);
      this.showToast('যাচাইকরণ ইমেইল পুনরায় পাঠানো হয়েছে', 'success');
      
      // Disable resend button for 60 seconds
      let countdown = 60;
      const countdownInterval = setInterval(() => {
        resendBtn.innerHTML = `<i class="fas fa-clock"></i> ${countdown} সেকেন্ড অপেক্ষা করুন`;
        countdown--;
        
        if (countdown < 0) {
          clearInterval(countdownInterval);
          resendBtn.innerHTML = originalText;
          resendBtn.disabled = false;
        }
      }, 1000);

    } catch (error) {
      this.handleAuthError(error);
      resendBtn.innerHTML = originalText;
      resendBtn.disabled = false;
    }
  }

  async checkEmailVerification() {
    if (!this.currentUser) {
      this.showToast('ব্যবহারকারী পাওয়া যায়নি', 'error');
      return;
    }

    const checkBtn = document.getElementById('check-verification');
    const originalText = checkBtn.innerHTML;
    
    checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> যাচাই করা হচ্ছে...';
    checkBtn.disabled = true;

    try {
      // Reload user to get latest verification status
      await this.currentUser.reload();
      
      if (this.currentUser.emailVerified) {
        this.showToast('ইমেইল সফলভাবে যাচাই হয়েছে!', 'success');
        this.showSuccessScreen(this.currentUser);
      } else {
        this.showToast('ইমেইল এখনও যাচাই হয়নি। অনুগ্রহ করে আপনার ইনবক্স চেক করুন।', 'warning');
      }

    } catch (error) {
      this.handleAuthError(error);
    } finally {
      checkBtn.innerHTML = originalText;
      checkBtn.disabled = false;
    }
  }

  // Validation Methods
  validateSignUpForm(fullName, email, password, confirmPassword, acceptTerms) {
    let isValid = true;

    // Full name validation
    if (!this.validateFullName(document.getElementById('fullName'))) {
      isValid = false;
    }

    // Email validation
    if (!this.validateGmailAddress(document.getElementById('email'))) {
      isValid = false;
    }

    // Password validation
    if (!this.validatePassword(document.getElementById('password'))) {
      isValid = false;
    }

    // Confirm password validation
    if (!this.validateConfirmPassword(document.getElementById('confirmPassword'))) {
      isValid = false;
    }

    // Terms acceptance
    if (!acceptTerms) {
      this.showToast('শর্তাবলী মেনে নিতে হবে', 'error');
      isValid = false;
    }

    return isValid;
  }

  validateLoginForm(email, password) {
    let isValid = true;

    if (!this.validateGmailAddress(document.getElementById('loginEmail'))) {
      isValid = false;
    }

    if (!password) {
      this.setInputFeedback(document.getElementById('loginPassword'), 'পাসওয়ার্ড প্রয়োজন', 'error');
      isValid = false;
    }

    return isValid;
  }

  validateFullName(input) {
    const value = input.value.trim();
    
    if (!value) {
      this.setInputFeedback(input, 'নাম প্রয়োজন', 'error');
      return false;
    }
    
    if (value.length < 2) {
      this.setInputFeedback(input, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে', 'error');
      return false;
    }
    
    if (!/^[a-zA-Zা-হ\s]+$/.test(value)) {
      this.setInputFeedback(input, 'শুধুমাত্র অক্ষর ও স্পেস ব্যবহার করুন', 'error');
      return false;
    }

    this.setInputFeedback(input, 'সঠিক নাম', 'success');
    return true;
  }

  validateGmailAddress(input) {
    const email = input.value.trim().toLowerCase();
    
    if (!email) {
      this.setInputFeedback(input, 'ইমেইল ঠিকানা প্রয়োজন', 'error');
      return false;
    }

    // Check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setInputFeedback(input, 'সঠিক ইমেইল ফরম্যাট নয়', 'error');
      return false;
    }

    // Check if it's a Gmail address
    if (!email.endsWith('@gmail.com')) {
      this.setInputFeedback(input, 'শুধুমাত্র Gmail ঠিকানা গ্রহণযোগ্য', 'error');
      return false;
    }

    this.setInputFeedback(input, 'সঠিক Gmail ঠিকানা', 'success');
    return true;
  }

  validatePassword(input) {
    const password = input.value;
    const strengthBar = input.closest('.form-group').querySelector('.strength-fill');
    const strengthText = input.closest('.form-group').querySelector('.strength-text');
    
    if (!password) {
      this.setInputFeedback(input, 'পাসওয়ার্ড প্রয়োজন', 'error');
      if (strengthBar) {
        strengthBar.className = 'strength-fill';
        strengthText.textContent = 'পাসওয়ার্ড শক্তি';
      }
      return false;
    }

    if (password.length < 6) {
      this.setInputFeedback(input, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
      if (strengthBar) {
        strengthBar.className = 'strength-fill weak';
        strengthText.textContent = 'দুর্বল পাসওয়ার্ড';
      }
      return false;
    }

    // Password strength calculation
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strengthBar && strengthText) {
      if (strength <= 2) {
        strengthBar.className = 'strength-fill weak';
        strengthText.textContent = 'দুর্বল পাসওয়ার্ড';
        this.setInputFeedback(input, 'পাসওয়ার্ড আরও শক্তিশালী করুন', 'error');
        return false;
      } else if (strength <= 3) {
        strengthBar.className = 'strength-fill medium';
        strengthText.textContent = 'মাঝারি পাসওয়ার্ড';
        this.setInputFeedback(input, 'ভালো পাসওয়ার্ড', 'success');
      } else {
        strengthBar.className = 'strength-fill strong';
        strengthText.textContent = 'শক্তিশালী পাসওয়ার্ড';
        this.setInputFeedback(input, 'চমৎকার পাসওয়ার্ড', 'success');
      }
    }

    return true;
  }

  validateConfirmPassword(input) {
    const password = document.getElementById('password').value;
    const confirmPassword = input.value;
    
    if (!confirmPassword) {
      this.setInputFeedback(input, 'পাসওয়ার্ড নিশ্চিত করুন', 'error');
      return false;
    }

    if (password !== confirmPassword) {
      this.setInputFeedback(input, 'পাসওয়ার্ড মিলছে না', 'error');
      return false;
    }

    this.setInputFeedback(input, 'পাসওয়ার্ড মিলেছে', 'success');
    return true;
  }

  validateEmail(input) {
    return this.validateGmailAddress(input);
  }

  // UI Helper Methods
  setInputFeedback(input, message, type) {
    const feedback = input.closest('.form-group').querySelector('.input-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `input-feedback ${type}`;
    }

    input.className = input.className.replace(/\b(valid|invalid)\b/g, '');
    if (type === 'success') {
      input.classList.add('valid');
    } else if (type === 'error') {
      input.classList.add('invalid');
    }
  }

  togglePasswordVisibility(passwordContainer) {
    const input = passwordContainer.querySelector('input');
    const icon = passwordContainer.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  }

  setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      button.disabled = true;
    } else {
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      button.disabled = false;
    }
  }

  showLoading(message = 'Loading...') {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    
    loadingText.textContent = message;
    loadingScreen.classList.remove('hidden');
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
  }

  showSignUpForm() {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('verification-screen').classList.add('hidden');
    document.getElementById('success-screen').classList.add('hidden');
  }

  showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('verification-screen').classList.add('hidden');
    document.getElementById('success-screen').classList.add('hidden');
  }

  showVerificationScreen(email) {
    document.getElementById('verification-screen').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('success-screen').classList.add('hidden');
    
    document.getElementById('verification-email').textContent = email;
    
    // Start checking verification status periodically
    this.startVerificationCheck();
  }

  showSuccessScreen(user) {
    document.getElementById('success-screen').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('verification-screen').classList.add('hidden');
    
    document.getElementById('welcome-user-name').textContent = user.displayName || user.email.split('@')[0];
    
    // Stop verification checking
    this.stopVerificationCheck();
  }

  startVerificationCheck() {
    // Check every 5 seconds if email is verified
    this.verificationCheckInterval = setInterval(async () => {
      if (this.currentUser) {
        try {
          await this.currentUser.reload();
          if (this.currentUser.emailVerified) {
            this.showSuccessScreen(this.currentUser);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      }
    }, 5000);
  }

  stopVerificationCheck() {
    if (this.verificationCheckInterval) {
      clearInterval(this.verificationCheckInterval);
      this.verificationCheckInterval = null;
    }
  }

  redirectToApp() {
    // Redirect to main app
    window.location.href = 'index.html';
  }

  handleAuthError(error) {
    console.error('Auth error:', error);
    
    let message = 'একটি সমস্যা হয়েছে';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'এই ইমেইল ঠিকানা ইতিমধ্যে ব্যবহৃত হচ্ছে';
        break;
      case 'auth/invalid-email':
        message = 'অবৈধ ইমেইল ঠিকানা';
        break;
      case 'auth/operation-not-allowed':
        message = 'এই অপারেশন অনুমোদিত নয়';
        break;
      case 'auth/weak-password':
        message = 'পাসওয়ার্ড খুবই দুর্বল';
        break;
      case 'auth/user-disabled':
        message = 'এই ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে';
        break;
      case 'auth/user-not-found':
        message = 'ব্যবহারকারী পাওয়া যায়নি';
        break;
      case 'auth/wrong-password':
        message = 'ভুল পাসওয়ার্ড';
        break;
      case 'auth/too-many-requests':
        message = 'অনেক বেশি চেষ্টা। কিছুক্ষণ পর আবার চেষ্টা করুন';
        break;
      case 'auth/network-request-failed':
        message = 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ চেক করুন';
        break;
      default:
        message = error.message || 'একটি অজানা সমস্যা হয়েছে';
    }
    
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 type === 'warning' ? 'fas fa-exclamation-triangle' :
                 'fas fa-info-circle';
    
    toast.innerHTML = `
      <i class="${icon}"></i>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FirebaseAuthManager();
});