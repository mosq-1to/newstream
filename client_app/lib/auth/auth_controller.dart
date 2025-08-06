import 'dart:async';

import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService = Get.find();

  Future<void> handleGoogleLogin() async {
    try {
      await _googleAuthService.signIn();
      unawaited(Get.offNamed('/homefeed'));
    } catch (e) {
      ToastService.showError('Something went wrong. Try again later');
      logger.e('[Error] AuthController.handleGoogleLogin', error: e);
    }
  }
}
