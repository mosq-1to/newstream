import 'package:flutter/widgets.dart';
import 'dart:ui' as ui;
import 'package:flutter_svg/flutter_svg.dart';

import '../common/theme/text_styles.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(children: [
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
            const SizedBox(height: 40),
            // TODO: Make it a button
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF606060).withOpacity(0.25),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 16, horizontal: 18),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        SvgPicture.asset(
                          'assets/icons/google.svg',
                          width: 24,
                          height: 24,
                        ),
                        const SizedBox(width: 16),
                        Text(
                          'Continue with Google',
                          style: TextStyles.body
                              .copyWith(fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    ]);
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
