import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();

  @override
  Future<void> onInit() async {
    super.onInit();

    if (await _newstreamApi.getCurrentUser() == null) {
      Get.offNamed('/auth');
    } else {
      Get.offNamed('/homefeed');
    }
  }
}
