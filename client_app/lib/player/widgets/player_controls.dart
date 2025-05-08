import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/utils/format_duration.dart';
import 'package:client_app/player/widgets/player_control_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PlayerControls extends StatelessWidget {
  final PlayerController controller = Get.find<PlayerController>();

  PlayerControls({
    super.key,
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
          _buildProgressBar(),
          const SizedBox(height: 16),
          _buildControlButtons(playerState.isPlaying),
        ],
      );
    });
  }

  Widget _buildProgressBar() {
    return Obx(() {
      final playerState = controller.playerState.value;
      final progress = playerState.progress;
      final position = playerState.position;
      final duration = playerState.duration;

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
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
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                formatDuration(position),
                style: TextStyles.bodySm.copyWith(
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
              Text(
                formatDuration(duration),
                style: TextStyles.bodySm.copyWith(
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ],
      );
    });
  }

  Widget _buildControlButtons(bool isPlaying) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        PlayerControlButton(
          onTap: controller.togglePlayPause,
          isPlaying: isPlaying,
          size: 64.0,
          iconSize: 36.0,
        ),
      ],
    );
  }
}
