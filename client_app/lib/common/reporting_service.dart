import 'dart:async';

import 'package:amplitude_flutter/amplitude.dart';
import 'package:amplitude_flutter/configuration.dart';
import 'package:amplitude_flutter/events/base_event.dart';
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
      await amplitude.track(
        BaseEvent(
          'Error',
          eventProperties: {
            'error': error.toString(),
            'stackTrace': stackTrace.toString(),
          },
        ),
      );
    } catch (err, st) {
      logger.e(err, stackTrace: st);
    }
    logger.e(error, stackTrace: stackTrace);
  }

  static Future<void> reportEvent(
    String eventName, {
    Map<String, String> eventProperties = const {},
  }) async {
    try {
      await amplitude.track(
        BaseEvent(eventName, eventProperties: eventProperties),
      );
    } catch (err, st) {
      unawaited(reportError(err, st));
    }
  }
}
