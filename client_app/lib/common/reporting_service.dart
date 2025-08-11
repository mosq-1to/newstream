import 'dart:async';

import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

class ReportingService {
  static Future<void> reportError(
    Object error,
    StackTrace stackTrace, {
    bool showToast = false,
  }) async {
    if (showToast) {
      ToastService.showError('Something went wrong. Try again later');
    }
    try {
      await Sentry.captureException(error, stackTrace: stackTrace);
    } catch (err, st) {
      logger.e(err, stackTrace: st);
    }
    logger.e(error, stackTrace: stackTrace);
  }
}
