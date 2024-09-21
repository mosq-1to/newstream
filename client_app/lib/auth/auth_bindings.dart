import 'package:client_app/api/newstream/newsteram_api.dart';
import 'package:client_app/auth/auth_controller.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:get/get.dart';

class AuthBindings implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(
      () => GoogleAuthService(newstreamApi: Get.find<NewstreamApi>()),
    );
    Get.lazyPut(
      () => AuthController(
          googleAuthService: Get.find(), userService: Get.find()),
    );
  }
}
