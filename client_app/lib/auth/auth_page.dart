import 'package:flutter/widgets.dart';
import 'dart:ui' as ui;

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
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome to Newstream',
              style: TextStyle(
                fontSize: 24,
                color: Color(0xFFFFFFFF),
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Stay up to date with no effort',
              style: TextStyle(
                fontSize: 16,
                color: Color(0xFFFFFFFF),
              ),
            ),
            const SizedBox(height: 40),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFFFFFFF),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Image.network(
                      'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
                      width: 24,
                      height: 24,
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      'Continue with Google',
                      style: TextStyle(
                        color: Color(0xFF000000),
                      ),
                    ),
                  ],
                ),
              ),
            ),
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
