import 'package:client_app/player/player_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PlayerControls extends StatelessWidget {
  final bool showTitle;
  final bool largeControls;
  
  final PlayerController controller = Get.find<PlayerController>();

  PlayerControls({
    super.key,
    this.showTitle = true,
    this.largeControls = false,
  });

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentStory = playerState.currentStory;

      if (currentStory == null) {
        return const SizedBox.shrink();
      }

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showTitle) ...[
            Text(
              currentStory.title,
              style: TextStyle(
                fontSize: largeControls ? 24 : 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 24),
          ],
          _buildProgressBar(),
          const SizedBox(height: 16),
          _buildControlButtons(playerState.isPlaying),
        ],
      );
    });
  }

  Widget _buildProgressBar() {
    return Obx(() {
      final progress = controller.playerState.value.progress;

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            height: largeControls ? 6 : 4,
            width: double.infinity,
            decoration: BoxDecoration(
              color: const Color(0xFF333333),
              borderRadius: BorderRadius.circular(largeControls ? 3 : 2),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(largeControls ? 3 : 2),
                ),
              ),
            ),
          ),
        ],
      );
    });
  }

  Widget _buildControlButtons(bool isPlaying) {
    final buttonSize = largeControls ? 64.0 : 40.0;
    final iconSize = largeControls ? 36.0 : 24.0;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector(
          onTap: controller.togglePlayPause,
          child: Container(
            width: buttonSize,
            height: buttonSize,
            decoration: BoxDecoration(
              color: const Color(0xFF333333),
              borderRadius: BorderRadius.circular(buttonSize / 2),
            ),
            child: Icon(
              isPlaying ? Icons.pause : Icons.play_arrow,
              color: Colors.white,
              size: iconSize,
            ),
          ),
        ),
      ],
    );
  }
}
