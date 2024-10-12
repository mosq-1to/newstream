import 'package:client_app/auth/auth_controller.dart';
import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/ui/button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();

    return Scaffold(
      body: DarkBackgroundLayout(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const SizedBox(height: 100),
              const Column(children: [
                Text(
                  'Welcome to Newstream',
                  style: TextStyles.headingLg,
                ),
                SizedBox(height: 10),
                Text(
                  'Stay up to date with no effort',
                  style: TextStyles.body,
                ),
              ]),
              const SizedBox(height: 40),
              Button(
                locator: const Key('auth_page_google_button'),
                startChild: SvgPicture.asset(
                  'assets/icons/google.svg',
                  width: 24,
                  height: 24,
                ),
                text: 'Continue with Google',
                onPressed: authController.handleGoogleLogin,
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }
}
