import 'package:client_app/common/theme/dark_background_container.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final controller = Get.find<HomefeedController>();

    return Obx(
      () => Scaffold(
        body: DarkBackgroundContainer(
          child: Center(
            child: Text(
              controller.isUserLoggedIn.value ? 'Homefeed' : 'Loading...',
            ),
          ),
        ),
      ),
    );
  }
}
