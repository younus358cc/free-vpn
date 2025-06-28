import 'package:flutter/material.dart';
import 'package:openvpn_flutter/openvpn_flutter.dart';
import '../models/vpn_server.dart';

enum VpnStatus { disconnected, connecting, connected, disconnecting, error }

class VpnProvider extends ChangeNotifier {
  VpnStatus _status = VpnStatus.disconnected;
  VpnServer? _connectedServer;
  String _connectionTime = '00:00:00';
  int _downloadSpeed = 0;
  int _uploadSpeed = 0;
  int _totalDownload = 0;
  int _totalUpload = 0;
  String? _errorMessage;
  
  late OpenVPN _openVPN;

  VpnProvider() {
    _initializeVPN();
  }

  // Getters
  VpnStatus get status => _status;
  VpnServer? get connectedServer => _connectedServer;
  String get connectionTime => _connectionTime;
  int get downloadSpeed => _downloadSpeed;
  int get uploadSpeed => _uploadSpeed;
  int get totalDownload => _totalDownload;
  int get totalUpload => _totalUpload;
  String? get errorMessage => _errorMessage;
  bool get isConnected => _status == VpnStatus.connected;
  bool get isConnecting => _status == VpnStatus.connecting;
  bool get isDisconnecting => _status == VpnStatus.disconnecting;

  void _initializeVPN() {
    _openVPN = OpenVPN(
      onVpnStatusChanged: _onVpnStatusChanged,
      onVpnStageChanged: _onVpnStageChanged,
    );
  }

  void _onVpnStatusChanged(VpnStatus? status) {
    if (status != null) {
      _status = status;
      notifyListeners();
    }
  }

  void _onVpnStageChanged(String stage, String rawStage) {
    // Handle VPN stage changes
    print('VPN Stage: $stage - $rawStage');
  }

  Future<void> connect(VpnServer server) async {
    try {
      _status = VpnStatus.connecting;
      _connectedServer = server;
      _errorMessage = null;
      notifyListeners();

      // Simulate connection process
      await Future.delayed(const Duration(seconds: 3));

      // In a real implementation, you would use the actual OpenVPN config
      final config = _generateOpenVPNConfig(server);
      
      // For demo purposes, we'll simulate a successful connection
      _status = VpnStatus.connected;
      _startConnectionTimer();
      _startSpeedMonitoring();
      
      notifyListeners();
    } catch (e) {
      _status = VpnStatus.error;
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  Future<void> disconnect() async {
    try {
      _status = VpnStatus.disconnecting;
      notifyListeners();

      // Simulate disconnection
      await Future.delayed(const Duration(seconds: 2));

      _status = VpnStatus.disconnected;
      _connectedServer = null;
      _connectionTime = '00:00:00';
      _downloadSpeed = 0;
      _uploadSpeed = 0;
      _errorMessage = null;
      
      notifyListeners();
    } catch (e) {
      _status = VpnStatus.error;
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  String _generateOpenVPNConfig(VpnServer server) {
    return '''
client
dev tun
proto udp
remote ${server.ipAddress} ${server.port}
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
auth SHA256
key-direction 1
verb 3
''';
  }

  void _startConnectionTimer() {
    // In a real app, you'd use a proper timer
    // This is simplified for demo purposes
  }

  void _startSpeedMonitoring() {
    // Simulate network speed monitoring
    Future.delayed(const Duration(seconds: 1), () {
      if (_status == VpnStatus.connected) {
        _downloadSpeed = 1500 + (500 * (DateTime.now().millisecond / 1000)).round();
        _uploadSpeed = 800 + (200 * (DateTime.now().millisecond / 1000)).round();
        _totalDownload += _downloadSpeed ~/ 8; // Convert to bytes
        _totalUpload += _uploadSpeed ~/ 8;
        notifyListeners();
        _startSpeedMonitoring(); // Continue monitoring
      }
    });
  }

  String formatBytes(int bytes) {
    if (bytes < 1024) return '${bytes}B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)}KB';
    if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)}MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)}GB';
  }

  String formatSpeed(int bitsPerSecond) {
    if (bitsPerSecond < 1024) return '${bitsPerSecond}bps';
    if (bitsPerSecond < 1024 * 1024) return '${(bitsPerSecond / 1024).toStringAsFixed(1)}Kbps';
    return '${(bitsPerSecond / (1024 * 1024)).toStringAsFixed(1)}Mbps';
  }
}