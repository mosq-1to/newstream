import 'dart:async';

import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/common/analytics/analytics_event.dart';
import 'package:client_app/common/reporting_service.dart';
import 'package:get/get.dart';

class AuthController extends GetxController {
  final GoogleAuthService _googleAuthService = Get.find();

  Future<void> handleGoogleLogin() async {
    try {
      await _googleAuthService.signIn();
      await Get.offNamed('/homefeed');
      unawaited(ReportingService.reportEvent(
        SignInEvent(provider: SignInProvider.google),
      ));
    } catch (e, st) {
      unawaited(ReportingService.reportError(e, st, showToast: true));
    }
  }
}
