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

  /// Builds a seek bar with draggable dot to seek playback position.
  Widget _buildProgressBar() {
    return Obx(() {
      final playerState = controller.playerState.value;
      final progress = playerState.progress;
      final position = playerState.position;
      final duration = playerState.duration ?? Duration.zero;

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              final width = constraints.maxWidth;
              const barHeight = 4.0;
              const dragAreaHeight = 20.0;
              const dotSize = 8.0;
              final filledWidth = (width * progress).clamp(0.0, width);
              return GestureDetector(
                behavior: HitTestBehavior.translucent,
                onTapDown: (details) {
                  final dx = details.localPosition.dx.clamp(0.0, width);
                  final newProgress = (dx / width).clamp(0.0, 1.0).toDouble();
                  final newPosition = Duration(
                    milliseconds:
                        (duration.inMilliseconds * newProgress).round(),
                  );
                  controller.seek(newPosition);
                },
                onHorizontalDragUpdate: (details) {
                  final dx = details.localPosition.dx.clamp(0.0, width);
                  final newProgress = (dx / width).clamp(0.0, 1.0).toDouble();
                  final newPosition = Duration(
                    milliseconds:
                        (duration.inMilliseconds * newProgress).round(),
                  );
                  controller.seek(newPosition);
                },
                child: SizedBox(
                  width: double.infinity,
                  height: dragAreaHeight,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Positioned(
                        left: 0,
                        top: (dragAreaHeight - barHeight) / 2,
                        child: Container(
                          width: width,
                          height: barHeight,
                          decoration: BoxDecoration(
                            color: const Color(0xFF333333),
                            borderRadius: BorderRadius.circular(barHeight / 2),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 0,
                        top: (dragAreaHeight - barHeight) / 2,
                        child: Container(
                          width: filledWidth,
                          height: barHeight,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(barHeight / 2),
                          ),
                        ),
                      ),
                      Positioned(
                        left: (filledWidth - dotSize / 2)
                            .clamp(0.0, width - dotSize),
                        top: (dragAreaHeight - dotSize) / 2,
                        child: Container(
                          width: dotSize,
                          height: dotSize,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
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
