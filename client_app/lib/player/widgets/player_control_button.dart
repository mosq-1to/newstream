import 'package:client_app/common/ui/tappable.dart';
import 'package:flutter/material.dart';

class PlayerControlButton extends StatelessWidget {
  final VoidCallback? onTap;
  final bool isPlaying;
  final double size;

  const PlayerControlButton({
    super.key,
    required this.onTap,
    required this.isPlaying,
    this.size = 40.0,
    this.isLoading = false,
  });

  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return Tappable(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.2),
          ),
          borderRadius: BorderRadius.circular(size),
        ),
        child: isLoading
            ? SizedBox(
                height: size * 0.65,
                width: size * 0.65,
                child: const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  strokeWidth: 3,
                ),
              )
            : Icon(
                isPlaying ? Icons.pause : Icons.play_arrow,
                color: Colors.white,
                size: size * 0.65,
              ),
      ),
    );
  }
}
