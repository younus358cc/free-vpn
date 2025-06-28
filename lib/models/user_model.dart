class UserModel {
  final String id;
  final String email;
  final String name;
  final String? profileImage;
  final bool isPremium;
  final DateTime? premiumExpiryDate;
  final DateTime createdAt;
  final DateTime lastLoginAt;
  final int totalDataUsed;
  final int dailyDataUsed;
  final int monthlyDataUsed;
  final List<String> connectedDevices;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.profileImage,
    this.isPremium = false,
    this.premiumExpiryDate,
    required this.createdAt,
    required this.lastLoginAt,
    this.totalDataUsed = 0,
    this.dailyDataUsed = 0,
    this.monthlyDataUsed = 0,
    this.connectedDevices = const [],
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      profileImage: json['profileImage'],
      isPremium: json['isPremium'] ?? false,
      premiumExpiryDate: json['premiumExpiryDate'] != null
          ? DateTime.parse(json['premiumExpiryDate'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      lastLoginAt: DateTime.parse(json['lastLoginAt']),
      totalDataUsed: json['totalDataUsed'] ?? 0,
      dailyDataUsed: json['dailyDataUsed'] ?? 0,
      monthlyDataUsed: json['monthlyDataUsed'] ?? 0,
      connectedDevices: List<String>.from(json['connectedDevices'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'profileImage': profileImage,
      'isPremium': isPremium,
      'premiumExpiryDate': premiumExpiryDate?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'lastLoginAt': lastLoginAt.toIso8601String(),
      'totalDataUsed': totalDataUsed,
      'dailyDataUsed': dailyDataUsed,
      'monthlyDataUsed': monthlyDataUsed,
      'connectedDevices': connectedDevices,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    String? name,
    String? profileImage,
    bool? isPremium,
    DateTime? premiumExpiryDate,
    DateTime? createdAt,
    DateTime? lastLoginAt,
    int? totalDataUsed,
    int? dailyDataUsed,
    int? monthlyDataUsed,
    List<String>? connectedDevices,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      profileImage: profileImage ?? this.profileImage,
      isPremium: isPremium ?? this.isPremium,
      premiumExpiryDate: premiumExpiryDate ?? this.premiumExpiryDate,
      createdAt: createdAt ?? this.createdAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      totalDataUsed: totalDataUsed ?? this.totalDataUsed,
      dailyDataUsed: dailyDataUsed ?? this.dailyDataUsed,
      monthlyDataUsed: monthlyDataUsed ?? this.monthlyDataUsed,
      connectedDevices: connectedDevices ?? this.connectedDevices,
    );
  }

  String get formattedDataUsage {
    if (totalDataUsed < 1024) return '${totalDataUsed}MB';
    return '${(totalDataUsed / 1024).toStringAsFixed(1)}GB';
  }

  bool get isPremiumActive {
    if (!isPremium) return false;
    if (premiumExpiryDate == null) return true;
    return DateTime.now().isBefore(premiumExpiryDate!);
  }
}