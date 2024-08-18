import 'package:client_app/auth/auth_controller.dart';
import 'package:client_app/auth/auth_page.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

void main() {
  Get.put(const GoogleAuthService());
  Get.put(AuthController(Get.find()));

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return WidgetsApp(
      debugShowCheckedModeBanner: false,
      color: const Color(0xFFFFFFFF),
      builder: (context, child) {
        return const AuthPage();
      },
    );
  }
}
