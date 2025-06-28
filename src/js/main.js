// Application State
class VPNApp {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.isConnected = false;
    this.connectionStatus = 'disconnected';
    this.selectedServer = null;
    this.servers = [];
    this.connectionStats = {
      downloadSpeed: 0,
      uploadSpeed: 0,
      totalDownload: 0,
      totalUpload: 0,
      connectionTime: '00:00:00'
    };
    this.theme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.initializeServers();
    this.setupEventListeners();
    this.applyTheme();
    this.showSplashScreen();
    this.checkAuthStatus();
  }

  // Initialize VPN servers data
  initializeServers() {
    this.servers = [
      // Free Servers
      {
        id: 'bd_dhaka_1',
        name: 'Dhaka Free 1',
        country: 'Bangladesh',
        city: 'Dhaka',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        isPremium: false,
        load: 25,
        ping: 15,
        isActive: true
      },
      {
        id: 'bd_chittagong_1',
        name: 'Chittagong Free 1',
        country: 'Bangladesh',
        city: 'Chittagong',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        isPremium: false,
        load: 45,
        ping: 22,
        isActive: true
      },
      {
        id: 'sg_singapore_1',
        name: 'Singapore Free 1',
        country: 'Singapore',
        city: 'Singapore',
        flagUrl: 'https://flagcdn.com/w320/sg.png',
        isPremium: false,
        load: 65,
        ping: 35,
        isActive: true
      },
      {
        id: 'in_mumbai_1',
        name: 'Mumbai Free 1',
        country: 'India',
        city: 'Mumbai',
        flagUrl: 'https://flagcdn.com/w320/in.png',
        isPremium: false,
        load: 55,
        ping: 28,
        isActive: true
      },
      {
        id: 'us_newyork_1',
        name: 'New York Free 1',
        country: 'United States',
        city: 'New York',
        flagUrl: 'https://flagcdn.com/w320/us.png',
        isPremium: false,
        load: 75,
        ping: 180,
        isActive: true
      },
      // Premium Servers
      {
        id: 'bd_dhaka_premium',
        name: 'Dhaka Premium',
        country: 'Bangladesh',
        city: 'Dhaka',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        isPremium: true,
        load: 15,
        ping: 8,
        isActive: true
      },
      {
        id: 'sg_singapore_premium',
        name: 'Singapore Premium',
        country: 'Singapore',
        city: 'Singapore',
        flagUrl: 'https://flagcdn.com/w320/sg.png',
        isPremium: true,
        load: 20,
        ping: 25,
        isActive: true
      },
      {
        id: 'us_newyork_premium',
        name: 'New York Premium',
        country: 'United States',
        city: 'New York',
        flagUrl: 'https://flagcdn.com/w320/us.png',
        isPremium: true,
        load: 10,
        ping: 120,
        isActive: true
      },
      {
        id: 'uk_london_premium',
        name: 'London Premium',
        country: 'United Kingdom',
        city: 'London',
        flagUrl: 'https://flagcdn.com/w320/gb.png',
        isPremium: true,
        load: 18,
        ping: 140,
        isActive: true
      },
      {
        id: 'jp_tokyo_premium',
        name: 'Tokyo Premium',
        country: 'Japan',
        city: 'Tokyo',
        flagUrl: 'https://flagcdn.com/w320/jp.png',
        isPremium: true,
        load: 25,
        ping: 85,
        isActive: true
      }
    ];

    // Auto-select best free server
    this.selectedServer = this.getBestFreeServer();
  }

  getBestFreeServer() {
    const freeServers = this.servers.filter(s => !s.isPremium && s.isActive);
    if (freeServers.length === 0) return null;
    
    freeServers.sort((a, b) => (a.ping + a.load) - (b.ping + b.load));
    return freeServers[0];
  }

  // Setup event listeners
  setupEventListeners() {
    // Theme toggles
    document.getElementById('theme-toggle')?.addEventListener('change', () => {
      this.toggleTheme();
    });
    
    document.getElementById('header-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Auth forms
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });

    // Auth navigation
    document.getElementById('show-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showRegisterScreen();
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginScreen();
    });

    // Password toggles
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.target.closest('.input-group').querySelector('input');
        const icon = e.target.closest('button').querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
        }
      });
    });

    // Connection button
    document.getElementById('connection-button')?.addEventListener('click', () => {
      this.toggleConnection();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Server tabs
    document.querySelectorAll('.server-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchServerTab(tab);
      });
    });

    // Refresh servers
    document.getElementById('refresh-servers')?.addEventListener('click', () => {
      this.refreshServers();
    });

    // Logout buttons
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.logout();
    });

    document.getElementById('profile-logout')?.addEventListener('click', () => {
      this.logout();
    });
  }

  // Theme management
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    const themeToggle = document.getElementById('theme-toggle');
    const headerThemeBtn = document.getElementById('header-theme-toggle');
    
    if (themeToggle) {
      themeToggle.checked = this.theme === 'dark';
    }
    
    if (headerThemeBtn) {
      const icon = headerThemeBtn.querySelector('i');
      icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  // Screen management
  showSplashScreen() {
    setTimeout(() => {
      document.getElementById('splash-screen').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        if (this.isAuthenticated) {
          this.showMainApp();
        } else {
          this.showLoginScreen();
        }
      }, 500);
    }, 2000);
  }

  showLoginScreen() {
    this.hideAllScreens();
    document.getElementById('login-screen').classList.remove('hidden');
  }

  showRegisterScreen() {
    this.hideAllScreens();
    document.getElementById('register-screen').classList.remove('hidden');
  }

  showMainApp() {
    this.hideAllScreens();
    document.getElementById('main-app').classList.remove('hidden');
    this.updateUI();
    this.renderServers();
  }

  hideAllScreens() {
    document.querySelectorAll('.auth-screen, .main-app').forEach(screen => {
      screen.classList.add('hidden');
    });
  }

  // Authentication
  checkAuthStatus() {
    const userData = localStorage.getItem('vpn_user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
      } catch (e) {
        localStorage.removeItem('vpn_user');
      }
    }
  }

  async handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    
    if (!email || !password) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    this.setButtonLoading(loginBtn, true);

    // Simulate API call
    await this.delay(2000);

    if (email && password.length >= 6) {
      this.currentUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        isPremium: email.includes('premium'),
        memberSince: new Date().toLocaleDateString(),
        totalDataUsed: 0
      };

      localStorage.setItem('vpn_user', JSON.stringify(this.currentUser));
      this.isAuthenticated = true;
      
      this.showToast('Login successful!', 'success');
      this.showMainApp();
    } else {
      this.showToast('Invalid email or password', 'error');
    }

    this.setButtonLoading(loginBtn, false);
  }

  async handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const acceptTerms = document.getElementById('accept-terms').checked;
    const registerBtn = document.getElementById('register-btn');

    if (!name || !email || !password || !confirmPassword) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (!acceptTerms) {
      this.showToast('Please accept the terms and conditions', 'error');
      return;
    }

    this.setButtonLoading(registerBtn, true);

    // Simulate API call
    await this.delay(2000);

    this.currentUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      isPremium: false,
      memberSince: new Date().toLocaleDateString(),
      totalDataUsed: 0
    };

    localStorage.setItem('vpn_user', JSON.stringify(this.currentUser));
    this.isAuthenticated = true;
    
    this.showToast('Account created successfully!', 'success');
    this.showMainApp();
    this.setButtonLoading(registerBtn, false);
  }

  logout() {
    localStorage.removeItem('vpn_user');
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isConnected = false;
    this.connectionStatus = 'disconnected';
    this.showToast('Logged out successfully', 'success');
    this.showLoginScreen();
  }

  // VPN Connection
  async toggleConnection() {
    if (!this.selectedServer) {
      this.showToast('Please select a server first', 'warning');
      return;
    }

    if (this.connectionStatus === 'connecting' || this.connectionStatus === 'disconnecting') {
      return;
    }

    if (this.isConnected) {
      await this.disconnect();
    } else {
      await this.connect();
    }
  }

  async connect() {
    this.connectionStatus = 'connecting';
    this.updateConnectionUI();
    
    const connectionBtn = document.getElementById('connection-button');
    connectionBtn.querySelector('.button-content').classList.add('hidden');
    connectionBtn.querySelector('.connection-loader').classList.remove('hidden');

    // Simulate connection process
    await this.delay(3000);

    this.isConnected = true;
    this.connectionStatus = 'connected';
    this.updateConnectionUI();
    this.startStatsMonitoring();
    
    connectionBtn.querySelector('.button-content').classList.remove('hidden');
    connectionBtn.querySelector('.connection-loader').classList.add('hidden');
    
    this.showToast(`Connected to ${this.selectedServer.name}`, 'success');
  }

  async disconnect() {
    this.connectionStatus = 'disconnecting';
    this.updateConnectionUI();
    
    const connectionBtn = document.getElementById('connection-button');
    connectionBtn.querySelector('.button-content').classList.add('hidden');
    connectionBtn.querySelector('.connection-loader').classList.remove('hidden');

    // Simulate disconnection process
    await this.delay(2000);

    this.isConnected = false;
    this.connectionStatus = 'disconnected';
    this.stopStatsMonitoring();
    this.updateConnectionUI();
    
    connectionBtn.querySelector('.button-content').classList.remove('hidden');
    connectionBtn.querySelector('.connection-loader').classList.add('hidden');
    
    this.showToast('Disconnected from VPN', 'success');
  }

  startStatsMonitoring() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    this.statsInterval = setInterval(() => {
      if (this.isConnected) {
        // Simulate realistic network speeds
        this.connectionStats.downloadSpeed = 1500 + Math.random() * 500;
        this.connectionStats.uploadSpeed = 800 + Math.random() * 200;
        this.connectionStats.totalDownload += this.connectionStats.downloadSpeed / 8;
        this.connectionStats.totalUpload += this.connectionStats.uploadSpeed / 8;
        
        this.updateStatsUI();
      }
    }, 1000);
  }

  stopStatsMonitoring() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
    
    this.connectionStats = {
      downloadSpeed: 0,
      uploadSpeed: 0,
      totalDownload: 0,
      totalUpload: 0,
      connectionTime: '00:00:00'
    };
    
    this.updateStatsUI();
  }

  // Server management
  selectServer(server) {
    if (server.isPremium && !this.currentUser?.isPremium) {
      this.showToast('Premium subscription required for this server', 'warning');
      return;
    }

    this.selectedServer = server;
    this.updateSelectedServerUI();
    this.showToast(`Selected ${server.name}`, 'success');
  }

  async refreshServers() {
    const refreshBtn = document.getElementById('refresh-servers');
    const icon = refreshBtn.querySelector('i');
    
    icon.style.animation = 'spin 1s linear infinite';
    
    // Simulate server refresh
    await this.delay(2000);
    
    // Update server stats
    this.servers.forEach(server => {
      server.load = Math.max(5, Math.min(95, server.load + (Math.random() - 0.5) * 20));
      server.ping = Math.max(5, Math.min(300, server.ping + (Math.random() - 0.5) * 10));
    });
    
    this.renderServers();
    icon.style.animation = '';
    this.showToast('Servers refreshed', 'success');
  }

  // UI Updates
  updateUI() {
    if (!this.currentUser) return;

    // Update user info
    document.getElementById('user-name').textContent = this.currentUser.name;
    document.getElementById('welcome-name').textContent = this.currentUser.name;
    document.getElementById('profile-name').textContent = this.currentUser.name;
    document.getElementById('profile-email').textContent = this.currentUser.email;
    
    // Update status badge
    const statusBadge = document.getElementById('user-status');
    statusBadge.textContent = this.currentUser.isPremium ? 'PREMIUM' : 'FREE';
    statusBadge.className = `status-badge ${this.currentUser.isPremium ? 'premium' : ''}`;
    
    // Update profile stats
    document.getElementById('account-type').textContent = this.currentUser.isPremium ? 'Premium' : 'Free';
    document.getElementById('member-since').textContent = this.currentUser.memberSince;
    document.getElementById('total-data').textContent = this.formatBytes(this.currentUser.totalDataUsed);
    
    this.updateConnectionUI();
    this.updateSelectedServerUI();
  }

  updateConnectionUI() {
    const statusCard = document.querySelector('.connection-status-card');
    const statusIndicator = document.getElementById('status-indicator');
    const protectionStatus = document.getElementById('protection-status');
    const protectionMessage = document.getElementById('protection-message');
    const connectionStatus = document.getElementById('connection-status');
    const connectionButton = document.getElementById('connection-button');
    const statsSection = document.getElementById('connection-stats');

    if (this.isConnected) {
      statusCard.classList.add('connected');
      protectionStatus.textContent = 'PROTECTED';
      protectionMessage.textContent = 'Your connection is secure';
      connectionStatus.textContent = 'protected';
      connectionButton.classList.add('connected');
      connectionButton.querySelector('i').className = 'fas fa-stop';
      statsSection.classList.remove('hidden');
    } else {
      statusCard.classList.remove('connected');
      protectionStatus.textContent = 'NOT PROTECTED';
      protectionMessage.textContent = this.connectionStatus === 'connecting' ? 'Connecting...' : 
                                     this.connectionStatus === 'disconnecting' ? 'Disconnecting...' : 
                                     'Tap to connect to VPN';
      connectionStatus.textContent = 'not protected';
      connectionButton.classList.remove('connected');
      
      if (this.connectionStatus === 'connecting') {
        connectionButton.classList.add('connecting');
        connectionButton.querySelector('i').className = 'fas fa-hourglass-half';
      } else if (this.connectionStatus === 'disconnecting') {
        connectionButton.classList.add('connecting');
        connectionButton.querySelector('i').className = 'fas fa-hourglass-half';
      } else {
        connectionButton.classList.remove('connecting');
        connectionButton.querySelector('i').className = 'fas fa-power-off';
      }
      
      statsSection.classList.add('hidden');
    }
  }

  updateSelectedServerUI() {
    if (!this.selectedServer) return;

    const selectedServerCard = document.getElementById('selected-server');
    const flag = selectedServerCard.querySelector('.flag');
    const serverInfo = selectedServerCard.querySelector('.server-info');
    const loadDot = selectedServerCard.querySelector('.load-dot');
    const loadText = selectedServerCard.querySelector('.load-indicator span');
    const ping = selectedServerCard.querySelector('.ping');

    flag.src = this.selectedServer.flagUrl;
    flag.alt = this.selectedServer.country;
    
    serverInfo.querySelector('h5').textContent = this.selectedServer.name;
    serverInfo.querySelector('p').textContent = `${this.selectedServer.city}, ${this.selectedServer.country}`;
    
    loadText.textContent = `${this.selectedServer.load}%`;
    ping.textContent = `${this.selectedServer.ping}ms`;
    
    // Update load indicator color
    loadDot.className = 'load-dot';
    if (this.selectedServer.load < 30) {
      loadDot.classList.add('low');
    } else if (this.selectedServer.load < 70) {
      loadDot.classList.add('medium');
    } else {
      loadDot.classList.add('high');
    }
  }

  updateStatsUI() {
    document.getElementById('download-speed').textContent = this.formatSpeed(this.connectionStats.downloadSpeed);
    document.getElementById('upload-speed').textContent = this.formatSpeed(this.connectionStats.uploadSpeed);
    document.getElementById('total-download').textContent = this.formatBytes(this.connectionStats.totalDownload);
    document.getElementById('total-upload').textContent = this.formatBytes(this.connectionStats.totalUpload);
  }

  renderServers() {
    const freeServersContainer = document.getElementById('free-servers');
    const premiumServersContainer = document.getElementById('premium-servers');

    freeServersContainer.innerHTML = '';
    premiumServersContainer.innerHTML = '';

    this.servers.forEach(server => {
      const serverCard = this.createServerCard(server);
      
      if (server.isPremium) {
        premiumServersContainer.appendChild(serverCard);
      } else {
        freeServersContainer.appendChild(serverCard);
      }
    });
  }

  createServerCard(server) {
    const card = document.createElement('div');
    card.className = `server-card ${this.selectedServer?.id === server.id ? 'selected' : ''}`;
    
    const loadDotClass = server.load < 30 ? 'low' : server.load < 70 ? 'medium' : 'high';
    
    card.innerHTML = `
      <img src="${server.flagUrl}" alt="${server.country}" class="flag">
      <div class="server-info">
        <h5>${server.name} ${server.isPremium ? '<span style="color: #FFD700; font-size: 0.8em;">PRO</span>' : ''}</h5>
        <p>${server.city}, ${server.country}</p>
      </div>
      <div class="server-stats">
        <div class="load-indicator">
          <span class="load-dot ${loadDotClass}"></span>
          <span>${server.load}%</span>
        </div>
        <div class="ping">${server.ping}ms</div>
      </div>
    `;

    card.addEventListener('click', () => {
      this.selectServer(server);
      this.renderServers();
    });

    return card;
  }

  // Tab management
  switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  switchServerTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.server-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update server lists
    document.getElementById('free-servers').classList.toggle('hidden', tabName !== 'free');
    document.getElementById('premium-servers').classList.toggle('hidden', tabName !== 'premium');
  }

  // Utility functions
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

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-exclamation-triangle';
    
    toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatSpeed(bitsPerSecond) {
    if (bitsPerSecond < 1024) return Math.round(bitsPerSecond) + ' bps';
    if (bitsPerSecond < 1024 * 1024) return (bitsPerSecond / 1024).toFixed(1) + ' Kbps';
    return (bitsPerSecond / (1024 * 1024)).toFixed(1) + ' Mbps';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new VPNApp();
});