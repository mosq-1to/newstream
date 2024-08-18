import 'package:client_app/auth/auth_controller.dart';
import 'package:client_app/common/ui/button.dart';
import 'package:flutter/widgets.dart';
import 'dart:ui' as ui;
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';

import '../common/theme/text_styles.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();

    return Obx(() => Stack(children: [
          Container(color: const Color(0xFF000000)),

          // Blurred circles
          Positioned(
            top: 50,
            left: -50,
            child: CircleBlur(
              color: const Color(0xFFD95B66).withOpacity(0.9),
              size: 200,
              blurRadius: 100,
            ),
          ),

          Positioned(
            bottom: 50,
            right: -50,
            child: CircleBlur(
              color: const Color(0xFF3e568a).withOpacity(0.9),
              size: 200,
              blurRadius: 100,
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(height: 100),
                const Column(children: [
                  Text(
                    'Welcome to Newstream',
                    style: TextStyles.headline,
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Stay up to date with no effort',
                    style: TextStyles.body,
                  ),
                ]),
                Text('Hello ${authController.currentUser.value?.email}'),
                const SizedBox(height: 40),
                Button(
                    startChild: SvgPicture.asset(
                      'assets/icons/google.svg',
                      width: 24,
                      height: 24,
                    ),
                    text: 'Continue with Google',
                    onPressed: authController.handleGoogleLogin),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ]));
  }
}

class CircleBlur extends StatelessWidget {
  final Color color;
  final double size;
  final double blurRadius;

  const CircleBlur(
      {super.key,
      required this.color,
      required this.size,
      required this.blurRadius});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: blurRadius, sigmaY: blurRadius),
        child: Container(
          color: color.withOpacity(0),
        ),
      ),
    );
  }
}
