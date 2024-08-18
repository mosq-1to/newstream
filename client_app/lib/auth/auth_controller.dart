import 'package:client_app/auth/current_user_model.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService;
  final currentUser = Rx<CurrentUserModel?>(null);

  AuthController(this._googleAuthService);

  Future<void> handleGoogleLogin() async {
    currentUser.value = await _googleAuthService.signIn();
  }
}
