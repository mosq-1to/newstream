import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService = Get.find();
  final UserService _userService = Get.find();

  Future<void> handleGoogleLogin() async {
    final accessToken = await _googleAuthService.signIn();
    if (accessToken != null) {
      _onSuccessfulLogin(accessToken);
    }
  }

  void _onSuccessfulLogin(String accessToken) {
    _userService.saveUserAccessToken(accessToken);
    Get.offNamed('/homefeed');
  }
}
