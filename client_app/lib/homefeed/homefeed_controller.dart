import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final UserService _userService = Get.find();
  final Rx<CurrentUser?> currentUser = Rx<CurrentUser?>(null);

  @override
  Future<void> onInit() async {
    super.onInit();

    final accessToken = await _userService.getUserAccessToken();

    if (accessToken == null) {
      return;
    }

    currentUser.value = await _userService.getCurrentUser(accessToken);
  }
}
