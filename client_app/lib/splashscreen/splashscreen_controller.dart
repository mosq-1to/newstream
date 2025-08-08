import 'dart:async';

import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:get/get.dart';

class SplashscreenController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();

  @override
  Future<void> onInit() async {
    try {
      super.onInit();

      final currentUser = await _newstreamApi.getCurrentUser();

      if (currentUser == null) {
        unawaited(Get.offNamed('/auth'));
      } else {
        unawaited(Get.offNamed('/homefeed'));
      }
    } catch (e, st) {
      ToastService.showError('Something went wrong. Try again later');
      logger.e(
        '[Error] SplashscreenController.onInit',
        error: e,
        stackTrace: st,
      );
    }
  }
}
