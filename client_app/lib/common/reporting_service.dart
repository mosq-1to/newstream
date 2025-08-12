import 'dart:async';

import 'package:amplitude_flutter/amplitude.dart';
import 'package:amplitude_flutter/configuration.dart';
import 'package:amplitude_flutter/events/base_event.dart';
import 'package:client_app/common/analytics/analytics_event.dart';
import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:client_app/config/app_config.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

class ReportingService {
  static final amplitude = Amplitude(
    Configuration(apiKey: AppConfig().env.amplitudeApiKey),
  );

  static Future<void> setUserId(String? userId) async {
    await amplitude.setUserId(userId);
  }

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
      await reportEvent(ErrorEvent(error, stackTrace));
    } catch (err, st) {
      logger.e(err, stackTrace: st);
    }
    logger.e(error, stackTrace: stackTrace);
  }

  static Future<void> reportEvent(AnalyticsEvent event) async {
    try {
      await amplitude.isBuilt;
      await amplitude.track(
        BaseEvent(event.name, eventProperties: event.properties),
      );
    } catch (err, st) {
      unawaited(reportError(err, st));
    }
  }
}
