import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/newsteram_api.dart';
import 'package:client_app/user/user_store.dart';
import 'package:get/get.dart';

class UserService {
  final UserRepository _userRepository = Get.find();
  final NewstreamApi _newstreamApi = Get.find();

  Future<void> saveUserAccessToken(String token) {
    return _userRepository.setAccessToken(token);
  }

  Future<String?> getUserAccessToken() {
    return _userRepository.getAccessToken();
  }

  void setAccessToken(String accessToken) {
    _newstreamApi.setAccessToken(accessToken);
  }

  Future<CurrentUser?> getCurrentUser() async {
    final user = _newstreamApi.getCurrentUser();
    return user;
  }
}
