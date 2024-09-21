import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final UserService _userService = Get.find();

  @override
  void onInit() {
    super.onInit();

    _userService.getUserAccessToken().then(
      (accessToken) {
        if (accessToken != null) {
          Get.offNamed('/homefeed');
        } else {
          Get.offNamed('/auth');
        }
      },
    );
  }
}
