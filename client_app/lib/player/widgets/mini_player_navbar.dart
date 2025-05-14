import 'package:client_app/api/newstream/briefs/brief_model.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/pages/player_page.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/utils/format_duration.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MiniPlayerNavbar extends StatelessWidget {
  final PlayerController controller;

  const MiniPlayerNavbar({
    super.key,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentBrief = playerState.currentBrief;

      if (currentBrief == null) {
        return const SizedBox.shrink();
      }

      return GestureDetector(
        onTap: () => PlayerPage.show(context),
        child: Container(
          color: Colors.black,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  _buildStoryInfo(currentBrief.content),
                  _buildControls(playerState.isPlaying),
                ],
              ),
              const SizedBox(height: 4),
              _buildProgressBar(),
            ],
          ),
        ),
      );
    });
  }

  Widget _buildStoryInfo(String title) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              const Text(
                '1 day of ',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                ),
              ),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
          Text(
            'in 15 minutes',
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Obx(() {
      final playerState = controller.playerState.value;
      final progress = playerState.progress;

      return Stack(
        children: [
          Container(
            height: 3,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.3),
              borderRadius: BorderRadius.circular(1.5),
            ),
          ),
          FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: progress,
            child: Stack(
              alignment: Alignment.centerRight,
              children: [
                Container(
                  height: 3,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(1.5),
                  ),
                ),
                Container(
                  width: 12,
                  height: 12,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    });
  }

  Widget _buildControls(bool isPlaying) {
    return Container(
      width: 48,
      height: 48,
      child: IconButton(
        icon: Icon(
          isPlaying ? Icons.pause : Icons.play_arrow,
          color: Colors.white,
          size: 28,
        ),
        onPressed: controller.togglePlayPause,
      ),
    );
  }
}
