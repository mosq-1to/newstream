import 'package:flutter/material.dart';

class DarkBackgroundLayout extends StatelessWidget {
  final Widget child;

  const DarkBackgroundLayout({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(color: const Color(0xFF000000)),
        Padding(
          padding: const EdgeInsets.only(top: 32),
          child: child,
        ),
      ],
    );
  }
}
