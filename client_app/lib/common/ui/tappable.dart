import 'package:flutter/material.dart';

class Tappable extends StatefulWidget {
  final VoidCallback? onTap;
  final Widget child;

  const Tappable({
    required this.onTap,
    required this.child,
  });

  @override
  _TappableState createState() => _TappableState();
}

class _TappableState extends State<Tappable>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    )..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          _controller.reverse();
        }
      });

    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onTap != null) {
      _controller.forward(); // Start the animation on tap down
    }
  }

  void _onTapCancel() {
    _controller.reverse(); // Reverse if the tap is canceled
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapCancel: _onTapCancel,
      onTap: widget.onTap,
      child: ScaleTransition(
        scale: _scaleAnimation, // Use ScaleTransition for the scaling effect
        child: Container(
          child: widget.child,
        ),
      ),
    );
  }
}
