import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final UserService _userService = Get.find();

  @override
  Future<void> onInit() async {
    super.onInit();
    try {
      final user = await _userService.getCurrentUser();

      print('userid ${user?.id}');

      if (user != null) {
        return Get.offNamed('/homefeed');
      }
    } catch (e) {
      print('[Error] SplashscreenController.onInit: $e');
    }

    Get.offNamed('/auth');
  }
}
