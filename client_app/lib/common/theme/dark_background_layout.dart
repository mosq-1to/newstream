import 'dart:ui' as ui;

import 'package:flutter/material.dart';

class DarkBackgroundLayout extends StatelessWidget {
  final Widget child;

  const DarkBackgroundLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
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
        Padding(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top,
            bottom: MediaQuery.of(context).padding.bottom,
            left: 32,
            right: 32,
          ),
          child: child,
        ),
      ],
    );
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
