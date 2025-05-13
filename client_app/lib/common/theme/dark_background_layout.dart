import 'package:client_app/common/theme/app_spacing.dart';
import 'package:flutter/material.dart';

class DarkBackgroundLayout extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;

  const DarkBackgroundLayout({
    super.key,
    required this.child,
    this.padding = AppSpacing.screenPadding,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(color: const Color(0xFF000000)),
        Padding(
          padding: padding!,
          child: child,
        ),
      ],
    );
  }
}
