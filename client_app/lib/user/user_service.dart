import 'package:client_app/user/user_store.dart';

class UserService {
  final UserStore _userStore;

  UserService({required UserStore userStore}) : _userStore = userStore;

  Future<void> saveUserAccessToken(String token) {
    return _userStore.setAccessToken(token);
  }

  Future<String?> getUserAccessToken() {
    return _userStore.getAccessToken();
  }
}
