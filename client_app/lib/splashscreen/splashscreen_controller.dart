import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final UserService _userService = Get.find();

  @override
  Future<void> onInit() async {
    super.onInit();

    final accessToken = await _userService.getUserAccessToken();

    if (accessToken == null) {
      return Get.offNamed('/auth');
    }

    final user = await _userService.getCurrentUser(accessToken);

    if (user == null) {
      return Get.offNamed('/auth');
    }

    return Get.offNamed('/homefeed');
  }
}
