import 'package:client_app/user/user_store.dart';
import 'package:get/get.dart';

class UserService {
  final UserRepository _userRepository = Get.find();

  Future<void> saveUserAccessToken(String token) {
    return _userRepository.setAccessToken(token);
  }

  Future<String?> getUserAccessToken() {
    return _userRepository.getAccessToken();
  }
}
