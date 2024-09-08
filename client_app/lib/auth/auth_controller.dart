import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService;

  AuthController({required GoogleAuthService googleAuthService})
      : _googleAuthService = googleAuthService;

  Future<void> handleGoogleLogin() async {
    await _googleAuthService.signIn();
    // TODO Save the user to the UserService
    _onSuccessfulLogin();
  }

  void _onSuccessfulLogin() {
    Get.offNamed('/homefeed');
  }
}
