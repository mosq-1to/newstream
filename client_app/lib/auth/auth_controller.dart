import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService;
  final UserService _userService;

  AuthController({
    required GoogleAuthService googleAuthService,
    required UserService userService,
  })  : _googleAuthService = googleAuthService,
        _userService = userService;

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
