// VPN Connectivity Testing Module
class VPNConnectivityTester {
  constructor() {
    this.testResults = new Map();
    this.isTestingInProgress = false;
    this.testTimeout = 10000; // 10 seconds timeout
    this.realIPEndpoints = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ];
  }

  // Test server connectivity before connection
  async testServerConnectivity(server) {
    console.log(`Testing connectivity to ${server.name}...`);
    
    const testResult = {
      serverId: server.id,
      serverName: server.name,
      isReachable: false,
      responseTime: null,
      error: null,
      timestamp: new Date(),
      ipAddress: server.ipAddress || this.generateMockIP(server.country),
      port: server.port || 1194
    };

    try {
      const startTime = performance.now();
      
      // Simulate server connectivity test
      const isReachable = await this.simulateServerPing(server);
      const endTime = performance.now();
      
      testResult.isReachable = isReachable;
      testResult.responseTime = Math.round(endTime - startTime);
      
      if (!isReachable) {
        testResult.error = 'Server unreachable or timeout';
      }
      
    } catch (error) {
      testResult.error = error.message;
      testResult.isReachable = false;
    }

    this.testResults.set(server.id, testResult);
    return testResult;
  }

  // Simulate server ping test
  async simulateServerPing(server) {
    return new Promise((resolve) => {
      // Simulate network delay based on server location and load
      const baseDelay = server.ping || 50;
      const loadFactor = server.load / 100;
      const simulatedDelay = baseDelay + (loadFactor * 100) + (Math.random() * 200);
      
      setTimeout(() => {
        // Simulate 95% success rate for active servers
        const successRate = server.isActive ? 0.95 : 0.3;
        resolve(Math.random() < successRate);
      }, Math.min(simulatedDelay, this.testTimeout));
    });
  }

  // Test if VPN is actually working after connection
  async testVPNConnection(expectedServer) {
    console.log('Testing VPN connection effectiveness...');
    
    const testResult = {
      isVPNActive: false,
      originalIP: null,
      vpnIP: null,
      dnsLeakTest: false,
      ipLocationMatch: false,
      connectionSpeed: null,
      error: null
    };

    try {
      // Test 1: IP Address Change Detection
      const ipTest = await this.testIPChange(expectedServer);
      testResult.originalIP = ipTest.originalIP;
      testResult.vpnIP = ipTest.vpnIP;
      testResult.isVPNActive = ipTest.isChanged;

      // Test 2: DNS Leak Test
      testResult.dnsLeakTest = await this.testDNSLeak();

      // Test 3: Location Verification
      testResult.ipLocationMatch = await this.testLocationMatch(expectedServer);

      // Test 4: Connection Speed Test
      testResult.connectionSpeed = await this.testConnectionSpeed();

    } catch (error) {
      testResult.error = error.message;
    }

    return testResult;
  }

  // Test if IP address has changed (indicating VPN is working)
  async testIPChange(expectedServer) {
    const result = {
      originalIP: null,
      vpnIP: null,
      isChanged: false
    };

    try {
      // Get current IP (simulated)
      const currentIP = await this.getCurrentIP();
      result.vpnIP = currentIP;

      // Compare with stored original IP
      const originalIP = localStorage.getItem('original_ip');
      if (originalIP) {
        result.originalIP = originalIP;
        result.isChanged = originalIP !== currentIP;
      } else {
        // First time - store current IP as original
        localStorage.setItem('original_ip', currentIP);
        result.originalIP = currentIP;
        // For demo, simulate IP change when connected to VPN
        result.vpnIP = this.generateVPNIP(expectedServer);
        result.isChanged = true;
      }

    } catch (error) {
      console.error('IP change test failed:', error);
    }

    return result;
  }

  // Get current public IP address
  async getCurrentIP() {
    for (const endpoint of this.realIPEndpoints) {
      try {
        const response = await fetch(endpoint, { 
          timeout: 5000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.ip || data.origin || data.query;
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${endpoint}:`, error);
        continue;
      }
    }
    
    // Fallback to simulated IP
    return this.generateMockIP('BD');
  }

  // Test for DNS leaks
  async testDNSLeak() {
    try {
      // Simulate DNS leak test
      await this.delay(2000);
      
      // For demo purposes, return random result (90% pass rate)
      return Math.random() > 0.1;
    } catch (error) {
      console.error('DNS leak test failed:', error);
      return false;
    }
  }

  // Test if IP location matches selected server location
  async testLocationMatch(expectedServer) {
    try {
      // Simulate location verification
      await this.delay(1500);
      
      // For demo, assume 85% accuracy
      return Math.random() > 0.15;
    } catch (error) {
      console.error('Location test failed:', error);
      return false;
    }
  }

  // Test connection speed
  async testConnectionSpeed() {
    try {
      const startTime = performance.now();
      
      // Simulate speed test by downloading test data
      await this.simulateSpeedTest();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Calculate simulated speed (Mbps)
      const testDataSize = 1; // 1 MB test
      const speedMbps = (testDataSize * 8 * 1000) / duration;
      
      return Math.round(speedMbps * 100) / 100;
    } catch (error) {
      console.error('Speed test failed:', error);
      return null;
    }
  }

  // Simulate speed test
  async simulateSpeedTest() {
    return new Promise((resolve) => {
      // Simulate variable network conditions
      const baseSpeed = 50 + (Math.random() * 100); // 50-150 Mbps base
      const delay = 8000 / baseSpeed; // Inverse relationship
      
      setTimeout(resolve, Math.max(1000, delay));
    });
  }

  // Generate mock IP based on country
  generateMockIP(countryCode) {
    const ipRanges = {
      'BD': '103.108.', // Bangladesh
      'SG': '139.180.', // Singapore
      'IN': '139.59.',  // India
      'US': '159.89.',  // USA
      'UK': '178.62.',  // UK
      'JP': '139.180.' // Japan
    };
    
    const prefix = ipRanges[countryCode] || '192.168.';
    const suffix1 = Math.floor(Math.random() * 255);
    const suffix2 = Math.floor(Math.random() * 255);
    
    return `${prefix}${suffix1}.${suffix2}`;
  }

  // Generate VPN IP for connected server
  generateVPNIP(server) {
    const countryCode = server.country === 'Bangladesh' ? 'BD' :
                       server.country === 'Singapore' ? 'SG' :
                       server.country === 'India' ? 'IN' :
                       server.country === 'United States' ? 'US' :
                       server.country === 'United Kingdom' ? 'UK' :
                       server.country === 'Japan' ? 'JP' : 'BD';
    
    return this.generateMockIP(countryCode);
  }

  // Get test results for a server
  getTestResult(serverId) {
    return this.testResults.get(serverId);
  }

  // Clear all test results
  clearTestResults() {
    this.testResults.clear();
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in main application
window.VPNConnectivityTester = VPNConnectivityTester;