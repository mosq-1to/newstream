import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/auth/auth_bindings.dart';
import 'package:client_app/auth/auth_page.dart';
import 'package:client_app/config/app_config.dart';
import 'package:client_app/homefeed/homefeed_bindings.dart';
import 'package:client_app/homefeed/homefeed_page.dart';
import 'package:client_app/player/player_bindings.dart';
import 'package:client_app/splashscreen/splashscreen_bindings.dart';
import 'package:client_app/splashscreen/splashscreen_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:audio_session/audio_session.dart';

void main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize app config
  await AppConfig().initialize();

  // Configure audio session
  final session = await AudioSession.instance;
  await session.configure(const AudioSessionConfiguration.speech());

  runApp(const MyApp());
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
          page: () => HomefeedPage(),
          binding: HomefeedBindings(),
        ),
      ],
    );
  }
}
