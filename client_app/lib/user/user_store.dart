import 'package:shared_preferences/shared_preferences.dart';

class UserStore {
  Future<void> setAccessToken(String token) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    await prefs.setString('UserStore.accessToken', token);
  }

  Future<String?> getAccessToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    return prefs.getString('UserStore.accessToken');
  }
}
