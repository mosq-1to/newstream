import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService;

  AuthController({required GoogleAuthService googleAuthService})
      : _googleAuthService = googleAuthService;

  Future<void> handleGoogleLogin() async {
    final accessToken = await _googleAuthService.signIn();
    if (accessToken != null) {
      _onSuccessfulLogin(accessToken);
    }
  }

  void _onSuccessfulLogin(String accessToken) {
    Get.offNamed('/homefeed');
  }
}
