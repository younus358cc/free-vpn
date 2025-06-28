import 'package:flutter/material.dart';
import '../models/vpn_server.dart';

class ServerProvider extends ChangeNotifier {
  List<VpnServer> _servers = [];
  VpnServer? _selectedServer;
  bool _isLoading = false;

  List<VpnServer> get servers => _servers;
  List<VpnServer> get freeServers => _servers.where((s) => !s.isPremium).toList();
  List<VpnServer> get premiumServers => _servers.where((s) => s.isPremium).toList();
  VpnServer? get selectedServer => _selectedServer;
  bool get isLoading => _isLoading;

  ServerProvider() {
    _initializeServers();
  }

  void _initializeServers() {
    _servers = [
      // Free Servers
      VpnServer(
        id: 'bd_dhaka_1',
        name: 'Dhaka Free 1',
        country: 'Bangladesh',
        city: 'Dhaka',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        ipAddress: '103.108.140.1',
        port: 1194,
        isPremium: false,
        load: 25,
        ping: 15,
        latitude: 23.8103,
        longitude: 90.4125,
        configData: 'bd_dhaka_1_config',
      ),
      VpnServer(
        id: 'bd_chittagong_1',
        name: 'Chittagong Free 1',
        country: 'Bangladesh',
        city: 'Chittagong',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        ipAddress: '103.108.141.1',
        port: 1194,
        isPremium: false,
        load: 45,
        ping: 22,
        latitude: 22.3569,
        longitude: 91.7832,
        configData: 'bd_chittagong_1_config',
      ),
      VpnServer(
        id: 'sg_singapore_1',
        name: 'Singapore Free 1',
        country: 'Singapore',
        city: 'Singapore',
        flagUrl: 'https://flagcdn.com/w320/sg.png',
        ipAddress: '139.180.132.1',
        port: 1194,
        isPremium: false,
        load: 65,
        ping: 35,
        latitude: 1.3521,
        longitude: 103.8198,
        configData: 'sg_singapore_1_config',
      ),
      VpnServer(
        id: 'in_mumbai_1',
        name: 'Mumbai Free 1',
        country: 'India',
        city: 'Mumbai',
        flagUrl: 'https://flagcdn.com/w320/in.png',
        ipAddress: '139.59.1.1',
        port: 1194,
        isPremium: false,
        load: 55,
        ping: 28,
        latitude: 19.0760,
        longitude: 72.8777,
        configData: 'in_mumbai_1_config',
      ),
      VpnServer(
        id: 'us_newyork_1',
        name: 'New York Free 1',
        country: 'United States',
        city: 'New York',
        flagUrl: 'https://flagcdn.com/w320/us.png',
        ipAddress: '159.89.1.1',
        port: 1194,
        isPremium: false,
        load: 75,
        ping: 180,
        latitude: 40.7128,
        longitude: -74.0060,
        configData: 'us_newyork_1_config',
      ),

      // Premium Servers
      VpnServer(
        id: 'bd_dhaka_premium',
        name: 'Dhaka Premium',
        country: 'Bangladesh',
        city: 'Dhaka',
        flagUrl: 'https://flagcdn.com/w320/bd.png',
        ipAddress: '103.108.150.1',
        port: 1194,
        isPremium: true,
        load: 15,
        ping: 8,
        latitude: 23.8103,
        longitude: 90.4125,
        configData: 'bd_dhaka_premium_config',
      ),
      VpnServer(
        id: 'sg_singapore_premium',
        name: 'Singapore Premium',
        country: 'Singapore',
        city: 'Singapore',
        flagUrl: 'https://flagcdn.com/w320/sg.png',
        ipAddress: '139.180.150.1',
        port: 1194,
        isPremium: true,
        load: 20,
        ping: 25,
        latitude: 1.3521,
        longitude: 103.8198,
        configData: 'sg_singapore_premium_config',
      ),
      VpnServer(
        id: 'us_newyork_premium',
        name: 'New York Premium',
        country: 'United States',
        city: 'New York',
        flagUrl: 'https://flagcdn.com/w320/us.png',
        ipAddress: '159.89.150.1',
        port: 1194,
        isPremium: true,
        load: 10,
        ping: 120,
        latitude: 40.7128,
        longitude: -74.0060,
        configData: 'us_newyork_premium_config',
      ),
      VpnServer(
        id: 'uk_london_premium',
        name: 'London Premium',
        country: 'United Kingdom',
        city: 'London',
        flagUrl: 'https://flagcdn.com/w320/gb.png',
        ipAddress: '178.62.150.1',
        port: 1194,
        isPremium: true,
        load: 18,
        ping: 140,
        latitude: 51.5074,
        longitude: -0.1278,
        configData: 'uk_london_premium_config',
      ),
      VpnServer(
        id: 'jp_tokyo_premium',
        name: 'Tokyo Premium',
        country: 'Japan',
        city: 'Tokyo',
        flagUrl: 'https://flagcdn.com/w320/jp.png',
        ipAddress: '139.180.160.1',
        port: 1194,
        isPremium: true,
        load: 25,
        ping: 85,
        latitude: 35.6762,
        longitude: 139.6503,
        configData: 'jp_tokyo_premium_config',
      ),
    ];
    
    // Auto-select best free server
    _selectedServer = _getBestFreeServer();
    notifyListeners();
  }

  VpnServer? _getBestFreeServer() {
    final freeServers = _servers.where((s) => !s.isPremium && s.isActive).toList();
    if (freeServers.isEmpty) return null;
    
    freeServers.sort((a, b) => (a.ping + a.load).compareTo(b.ping + b.load));
    return freeServers.first;
  }

  void selectServer(VpnServer server) {
    _selectedServer = server;
    notifyListeners();
  }

  Future<void> refreshServers() async {
    _isLoading = true;
    notifyListeners();

    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));

    // Update server stats (simulate real-time data)
    for (var server in _servers) {
      server = VpnServer(
        id: server.id,
        name: server.name,
        country: server.country,
        city: server.city,
        flagUrl: server.flagUrl,
        ipAddress: server.ipAddress,
        port: server.port,
        isPremium: server.isPremium,
        load: (server.load + (-10 + (20 * (DateTime.now().millisecond / 1000)))).clamp(0, 100).round(),
        ping: (server.ping + (-5 + (10 * (DateTime.now().millisecond / 1000)))).clamp(1, 500).round(),
        latitude: server.latitude,
        longitude: server.longitude,
        configData: server.configData,
        isActive: server.isActive,
        maxUsers: server.maxUsers,
        currentUsers: server.currentUsers,
      );
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<int> testServerSpeed(VpnServer server) async {
    // Simulate speed test
    await Future.delayed(const Duration(seconds: 3));
    
    // Return simulated speed in Mbps
    if (server.isPremium) {
      return 80 + (20 * (1 - server.load / 100)).round();
    } else {
      return 30 + (20 * (1 - server.load / 100)).round();
    }
  }

  void autoSelectBestServer({bool premiumOnly = false}) {
    List<VpnServer> availableServers;
    
    if (premiumOnly) {
      availableServers = _servers.where((s) => s.isPremium && s.isActive).toList();
    } else {
      availableServers = _servers.where((s) => s.isActive).toList();
    }

    if (availableServers.isNotEmpty) {
      availableServers.sort((a, b) => (a.ping + a.load).compareTo(b.ping + b.load));
      _selectedServer = availableServers.first;
      notifyListeners();
    }
  }
}