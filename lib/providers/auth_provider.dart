import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';

import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final SharedPreferences _prefs;
  UserModel? _user;
  bool _isLoading = false;

  AuthProvider(this._prefs) {
    _loadUser();
  }

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  Future<void> _loadUser() async {
    final userData = _prefs.getString('user_data');
    if (userData != null) {
      try {
        final userMap = jsonDecode(userData);
        _user = UserModel.fromJson(userMap);
        notifyListeners();
      } catch (e) {
        await logout();
      }
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Simulate API call delay
      await Future.delayed(const Duration(seconds: 2));

      // Hash password for security
      final hashedPassword = sha256.convert(utf8.encode(password)).toString();

      // Mock authentication - In real app, this would be an API call
      if (email.isNotEmpty && password.length >= 6) {
        _user = UserModel(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          email: email,
          name: email.split('@')[0],
          createdAt: DateTime.now(),
          lastLoginAt: DateTime.now(),
          isPremium: email.contains('premium'),
        );

        await _saveUser();
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      await Future.delayed(const Duration(seconds: 2));

      if (name.isNotEmpty && email.isNotEmpty && password.length >= 6) {
        _user = UserModel(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          email: email,
          name: name,
          createdAt: DateTime.now(),
          lastLoginAt: DateTime.now(),
        );

        await _saveUser();
        _isLoading = false;
        notifyListeners();
        return true;
      }

      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> resetPassword(String email) async {
    _isLoading = true;
    notifyListeners();

    try {
      await Future.delayed(const Duration(seconds: 2));
      
      // Mock password reset
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> updateProfile(String name, String? profileImage) async {
    if (_user != null) {
      _user = _user!.copyWith(name: name, profileImage: profileImage);
      await _saveUser();
      notifyListeners();
    }
  }

  Future<void> upgradeToPremium() async {
    if (_user != null) {
      _user = _user!.copyWith(
        isPremium: true,
        premiumExpiryDate: DateTime.now().add(const Duration(days: 30)),
      );
      await _saveUser();
      notifyListeners();
    }
  }

  Future<void> _saveUser() async {
    if (_user != null) {
      await _prefs.setString('user_data', jsonEncode(_user!.toJson()));
    }
  }

  Future<void> logout() async {
    _user = null;
    await _prefs.remove('user_data');
    notifyListeners();
  }
}