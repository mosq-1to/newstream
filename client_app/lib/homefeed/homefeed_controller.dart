import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final UserService _userService;
  final isUserLoggedIn = false.obs;

  HomefeedController({
    required UserService userService,
  }) : _userService = userService;

  @override
  Future<void> onInit() async {
    final userAccessToken = await _userService.getUserAccessToken();

    if (userAccessToken != null) {
      isUserLoggedIn.value = true;
    }

    super.onInit();
  }
}
