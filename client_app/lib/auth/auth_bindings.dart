import 'package:client_app/auth/auth_controller.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthBindings implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(
      () => GoogleAuthService(),
    );
    Get.lazyPut(
      () => AuthController(),
    );
  }
}
