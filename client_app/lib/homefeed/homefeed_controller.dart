import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final UserService _userService = Get.find();
  final isUserLoggedIn = false.obs;

  @override
  Future<void> onInit() async {
    final userAccessToken = await _userService.getUserAccessToken();

    if (userAccessToken != null) {
      isUserLoggedIn.value = true;
    }

    super.onInit();
  }
}
