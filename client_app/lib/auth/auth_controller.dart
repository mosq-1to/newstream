import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService = Get.find();

  Future<void> handleGoogleLogin() async {
    try {
      await _googleAuthService.signIn();
      Get.offNamed('/homefeed');
    } catch (e) {
      print('[Error] AuthController.handleGoogleLogin: $e');
    }
  }
}
