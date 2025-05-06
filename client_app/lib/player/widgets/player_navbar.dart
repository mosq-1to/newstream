import 'dart:ui' as ui;

import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/ui/tappable.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PlayerNavbar extends StatelessWidget {
  final PlayerController controller = Get.find<PlayerController>();

  PlayerNavbar({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentStory = playerState.currentStory;

      if (currentStory == null) {
        return const SizedBox.shrink();
      }

      return Container(
        margin: const EdgeInsets.only(bottom: 8),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 15, sigmaY: 15),
            child: Container(
              height: 72,
              decoration: BoxDecoration(
                color: const Color.fromRGBO(23, 23, 23, 0.9),
                borderRadius: BorderRadius.circular(16),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildThumbnail(currentStory.thumbnailUrl),
                  const SizedBox(width: 12),
                  _buildStoryInfo(currentStory.title),
                  const SizedBox(width: 12),
                  _buildControls(playerState.isPlaying),
                ],
              ),
            ),
          ),
        ),
      );
    });
  }

  Widget _buildThumbnail(String thumbnailUrl) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.network(
        thumbnailUrl,
        width: 48,
        height: 48,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: 48,
            height: 48,
            color: const Color(0xFF333333),
            child: const Icon(
              Icons.image_not_supported,
              color: Colors.white,
              size: 24,
            ),
          );
        },
      ),
    );
  }

  Widget _buildStoryInfo(String title) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            title,
            style: TextStyles.headingSm,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          _buildProgressBar(),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Obx(() {
      final progress = controller.playerState.value.progress;

      return Container(
        height: 4,
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFF333333),
          borderRadius: BorderRadius.circular(2),
        ),
        child: FractionallySizedBox(
          alignment: Alignment.centerLeft,
          widthFactor: progress,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),
      );
    });
  }

  Widget _buildControls(bool isPlaying) {
    return Tappable(
      onTap: controller.togglePlayPause,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: const Color(0xFF333333),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Icon(
          isPlaying ? Icons.pause : Icons.play_arrow,
          color: Colors.white,
          size: 24,
        ),
      ),
    );
  }
}
