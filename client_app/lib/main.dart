import 'package:flutter/widgets.dart';

import 'auth/auth_page.dart';

void main() {
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