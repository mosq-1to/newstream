import 'package:client_app/common/ui/tappable.dart';
import 'package:flutter/material.dart';

class PlayerControlButton extends StatelessWidget {
  final VoidCallback? onTap;
  final bool isPlaying;
  final double size;
  final double iconSize;

  const PlayerControlButton({
    super.key,
    required this.onTap,
    required this.isPlaying,
    this.size = 40.0,
    this.iconSize = 24.0,
  });

  @override
  Widget build(BuildContext context) {
    return Tappable(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: const Color(0xFF333333),
          borderRadius: BorderRadius.circular(size / 2),
        ),
        child: Icon(
          isPlaying ? Icons.pause : Icons.play_arrow,
          color: Colors.white,
          size: iconSize,
        ),
      ),
    );
  }
}
