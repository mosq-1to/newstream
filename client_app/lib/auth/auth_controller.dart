import 'package:client_app/auth/current_user_model.dart';
import 'package:get/get.dart';

import 'google_auth_service.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService;
  final currentUser = Rx<CurrentUserModel?>(null);

  AuthController(this._googleAuthService);

  Future<void> handleGoogleLogin() async {
    currentUser.value = await _googleAuthService.openPrompt();
  }
}
