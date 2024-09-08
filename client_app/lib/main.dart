import 'package:client_app/api/newstream/newsteram_api.dart';
import 'package:client_app/auth/auth_bindings.dart';
import 'package:client_app/auth/auth_page.dart';
import 'package:client_app/homefeed/homefeed_page.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';

void main() async {
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      color: const Color(0xFFFFFFFF),
      initialRoute: '/auth',
      initialBinding: BindingsBuilder(() {
        Get.put(NewstreamApi());
      }),
      defaultTransition: Transition.fadeIn,
      getPages: [
        GetPage(
          name: '/auth',
          page: () => const AuthPage(),
          binding: AuthBindings(),
        ),
        GetPage(
          name: '/homefeed',
          page: () => HomefeedPage(),
        ),
      ],
    );
  }
}
