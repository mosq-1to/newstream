import 'dart:async';

import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/reporting_service.dart';
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
      await ReportingService.reportError(
        e,
        st,
        showToast: true,
      );
    }
  }
}
