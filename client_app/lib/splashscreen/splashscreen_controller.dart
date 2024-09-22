import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final UserService _userService = Get.find();

  @override
  Future<void> onInit() async {
    super.onInit();

    if (await _userService.getCurrentUser() == null) {
      Get.offNamed('/auth');
    } else {
      Get.offNamed('/homefeed');
    }
  }
}
