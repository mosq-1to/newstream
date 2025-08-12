import 'dart:async';

import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/auth/auth_bindings.dart';
import 'package:client_app/auth/auth_page.dart';
import 'package:client_app/common/reporting_service.dart';
import 'package:client_app/config/app_config.dart';
import 'package:client_app/homefeed/homefeed_bindings.dart';
import 'package:client_app/homefeed/homefeed_page.dart';
import 'package:client_app/player/player_bindings.dart';
import 'package:client_app/splashscreen/splashscreen_bindings.dart';
import 'package:client_app/splashscreen/splashscreen_page.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

void main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Set status bar to use light (white) icons
  unawaited(SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]));

  await ReportingService.reportEvent('Test');

  // Initialize app config
  await AppConfig().initialize();

  await SentryFlutter.init(
    (options) {
      options.dsn = AppConfig().env.sentryDsnUrl;
      options.sendDefaultPii = true;
      // Configure Session Replay
      options.replay.sessionSampleRate = 0.1;
      options.replay.onErrorSampleRate = 1.0;
      options.environment = kReleaseMode
          ? 'release'
          : kProfileMode
              ? 'profile'
              : 'debug';
    },
    appRunner: () => runApp(SentryWidget(child: const MyApp())),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      color: const Color(0xFFFFFFFF),
      initialRoute: '/splashscreen',
      initialBinding: BindingsBuilder(() {
        Get.put(NewstreamApi());
        PlayerBindings().dependencies();
      }),
      defaultTransition: Transition.fadeIn,
      getPages: [
        GetPage(
          name: '/splashscreen',
          page: () => SplashscreenPage(),
          binding: SplashscreenBindings(),
        ),
        GetPage(
          name: '/auth',
          page: () => const AuthPage(),
          binding: AuthBindings(),
        ),
        GetPage(
          name: '/homefeed',
          page: () => const HomefeedPage(),
          binding: HomefeedBindings(),
        ),
      ],
    );
  }
}
