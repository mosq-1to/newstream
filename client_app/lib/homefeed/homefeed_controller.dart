import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/user/user_service.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final UserService _userService = Get.find();
  final Rx<CurrentUser?> currentUser = Rx<CurrentUser?>(null);
  final NewstreamApi _newstreamApi = Get.find();
  final RxList<Story> stories = RxList<Story>([]);

  @override
  Future<void> onInit() async {
    super.onInit();
    currentUser.value = await _userService.getCurrentUser();
    stories.value = await _newstreamApi.getStories();
  }
}
