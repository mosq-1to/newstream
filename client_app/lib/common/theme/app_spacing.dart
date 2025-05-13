// lib/common/theme/spacing.dart
import 'package:flutter/material.dart';

class AppSpacing {
  static const double base = 8.0;

  static const double xs = base * 0.5; // 4
  static const double sm = base; // 8
  static const double md = base * 2; // 16
  static const double lg = base * 3; // 24
  static const double xl = base * 4; // 32
  static const double xxl = base * 6; // 48

  static const EdgeInsets screenPadding = EdgeInsets.symmetric(
    horizontal: md,
    vertical: xl,
  );
}
