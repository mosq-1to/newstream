import 'package:shared_preferences/shared_preferences.dart';

class UserRepository {
  UserRepository._();

  static Future<void> setAccessToken(String token) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    await prefs.setString('UserRepository.accessToken', token);
  }

  static Future<String?> getAccessToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    return prefs.getString('UserRepository.accessToken');
  }
}
