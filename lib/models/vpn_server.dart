class VpnServer {
  final String id;
  final String name;
  final String country;
  final String city;
  final String flagUrl;
  final String ipAddress;
  final int port;
  final bool isPremium;
  final int load;
  final int ping;
  final double latitude;
  final double longitude;
  final String configData;
  final bool isActive;
  final int maxUsers;
  final int currentUsers;

  VpnServer({
    required this.id,
    required this.name,
    required this.country,
    required this.city,
    required this.flagUrl,
    required this.ipAddress,
    required this.port,
    required this.isPremium,
    required this.load,
    required this.ping,
    required this.latitude,
    required this.longitude,
    required this.configData,
    this.isActive = true,
    this.maxUsers = 100,
    this.currentUsers = 0,
  });

  factory VpnServer.fromJson(Map<String, dynamic> json) {
    return VpnServer(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      country: json['country'] ?? '',
      city: json['city'] ?? '',
      flagUrl: json['flagUrl'] ?? '',
      ipAddress: json['ipAddress'] ?? '',
      port: json['port'] ?? 1194,
      isPremium: json['isPremium'] ?? false,
      load: json['load'] ?? 0,
      ping: json['ping'] ?? 0,
      latitude: json['latitude']?.toDouble() ?? 0.0,
      longitude: json['longitude']?.toDouble() ?? 0.0,
      configData: json['configData'] ?? '',
      isActive: json['isActive'] ?? true,
      maxUsers: json['maxUsers'] ?? 100,
      currentUsers: json['currentUsers'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'country': country,
      'city': city,
      'flagUrl': flagUrl,
      'ipAddress': ipAddress,
      'port': port,
      'isPremium': isPremium,
      'load': load,
      'ping': ping,
      'latitude': latitude,
      'longitude': longitude,
      'configData': configData,
      'isActive': isActive,
      'maxUsers': maxUsers,
      'currentUsers': currentUsers,
    };
  }

  String get loadStatus {
    if (load < 30) return 'Low';
    if (load < 70) return 'Medium';
    return 'High';
  }

  Color get loadColor {
    if (load < 30) return const Color(0xFF4CAF50);
    if (load < 70) return const Color(0xFFFF9800);
    return const Color(0xFFF44336);
  }

  String get pingStatus {
    if (ping < 50) return 'Excellent';
    if (ping < 100) return 'Good';
    if (ping < 200) return 'Fair';
    return 'Poor';
  }
}