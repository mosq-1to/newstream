import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final UserService _userService = Get.find();

  @override
  Future<void> onInit() async {
    super.onInit();

    final accessToken = await _userService.getUserAccessToken();
    if (accessToken != null) {
      _userService.setAccessToken(accessToken);
    }

    final user = await _userService.getCurrentUser();
    if (user == null) {
      return Get.offNamed('/auth');
    } else {
      return Get.offNamed('/homefeed');
    }
  }
}
