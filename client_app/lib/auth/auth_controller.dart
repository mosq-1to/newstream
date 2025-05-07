import 'package:client_app/auth/google_auth_service.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService = Get.find();

  Future<void> handleGoogleLogin() async {
    try {
      await _googleAuthService.signIn();
      Get.offNamed('/homefeed');
    } catch (e) {
      if (e is PlatformException) {
        print('[Error] AuthController.handleGoogleLogin: ${e.message}');
      } else {
        print('[Unknown error] AuthController.handleGoogleLogin: $e');
      }
    }
  }
}
