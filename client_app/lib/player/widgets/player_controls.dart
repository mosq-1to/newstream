import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/utils/format_duration.dart';
import 'package:client_app/player/widgets/player_control_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// A seek bar widget with a draggable thumb for real-time feedback.
class _SeekBar extends StatefulWidget {
  final double progress;
  final Duration position;
  final Duration duration;
  final ValueChanged<Duration> onSeek;

  const _SeekBar({
    required this.progress,
    required this.position,
    required this.duration,
    required this.onSeek,
  });

  @override
  __SeekBarState createState() => __SeekBarState();
}

class __SeekBarState extends State<_SeekBar> {
  double? _dragValue;

  @override
  Widget build(BuildContext context) {
    final effectiveProgress = _dragValue ?? widget.progress;
    final displayPosition = widget.duration == Duration.zero
        ? Duration.zero
        : Duration(
            milliseconds:
                (widget.duration.inMilliseconds * effectiveProgress).round(),
          );
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;
            const barHeight = 4.0;
            const dragAreaHeight = 20.0;
            const dotSize = 8.0;
            final filledWidth = (width * effectiveProgress).clamp(0.0, width);

            return GestureDetector(
              behavior: HitTestBehavior.translucent,
              onHorizontalDragStart: (_) {
                setState(() {
                  _dragValue = widget.progress;
                });
              },
              onHorizontalDragUpdate: (details) {
                final dx = details.localPosition.dx.clamp(0.0, width);
                final newProgress = (dx / width).clamp(0.0, 1.0).toDouble();
                setState(() {
                  _dragValue = newProgress;
                });
              },
              onHorizontalDragEnd: (_) {
                if (_dragValue != null) {
                  final newPosition = Duration(
                    milliseconds:
                        (widget.duration.inMilliseconds * _dragValue!).round(),
                  );
                  widget.onSeek(newPosition);
                }
                setState(() {
                  _dragValue = null;
                });
              },
              onTapUp: (TapUpDetails details) {
                final dx = details.localPosition.dx.clamp(0.0, width);
                final newProgress = (dx / width).clamp(0.0, 1.0).toDouble();
                final newPosition = Duration(
                  milliseconds:
                      (widget.duration.inMilliseconds * newProgress).round(),
                );
                widget.onSeek(newPosition);
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
              formatDuration(displayPosition),
              style: TextStyles.bodySm
                  .copyWith(color: Colors.white.withOpacity(0.7)),
            ),
            Text(
              formatDuration(widget.duration),
              style: TextStyles.bodySm
                  .copyWith(color: Colors.white.withOpacity(0.7)),
            ),
          ],
        ),
      ],
    );
  }
}

class PlayerControls extends StatelessWidget {
  final PlayerController controller = Get.find<PlayerController>();

  PlayerControls({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentBrief = playerState.currentBrief;

      if (currentBrief == null) {
        return const SizedBox.shrink();
      }

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _SeekBar(
            progress: playerState.progress,
            position: playerState.position,
            duration: playerState.duration ?? Duration.zero,
            onSeek: controller.seek,
          ),
          const SizedBox(height: 16),
          _buildControlButtons(playerState.isPlaying),
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
