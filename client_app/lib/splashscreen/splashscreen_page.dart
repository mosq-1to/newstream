import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/splashscreen/splashscreen_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SplashscreenPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final controller = Get.find<SplashscreenController>();

    return const Scaffold(
      body: DarkBackgroundLayout(
        child: Center(
          child: Image(
            image: AssetImage('assets/images/pepedance.gif'),
          ),
        ),
      ),
    );
  }
}
