import 'dart:async';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/analytics/analytics_event.dart';
import 'package:client_app/common/reporting_service.dart';
import 'package:client_app/player/pages/player_page.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_control_button.dart';
import 'package:client_app/player/widgets/player_controls.dart';
import 'package:client_app/utils/duration_formatter.dart';
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
        onTap: () {
          unawaited(ReportingService.reportEvent(
            UserTapEvent(screen: Get.currentRoute, label: 'Open Player'),
          ));
          unawaited(PlayerPage.show(context));
        },
        child: ColoredBox(
          color: Colors.black,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
                child: Row(
                  children: [
                    _buildThumbnail(),
                    const SizedBox(width: 12),
                    _buildStoryInfo(),
                    _buildControls(playerState.isPlaying),
                  ],
                ),
              ),
              _buildProgressBar(),
            ],
          ),
        ),
      );
    });
  }

  Widget _buildThumbnail() {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentBrief = playerState.currentBrief;

      if (currentBrief == null) {
        return const SizedBox.shrink();
      }

      return ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: currentBrief.topic.thumbnailUrl.isNotEmpty
            ? Image.network(
                currentBrief.topic.thumbnailUrl,
                width: 40,
                height: 40,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 40,
                  height: 40,
                  color: Colors.grey[800],
                ),
              )
            : Container(
                width: 40,
                height: 40,
                color: Colors.grey[800],
              ),
      );
    });
  }

  Widget _buildStoryInfo() {
    return Obx(() {
      final playerState = controller.playerState.value;
      final currentBrief = playerState.currentBrief;

      if (currentBrief == null) {
        return const SizedBox.shrink();
      }

      return Expanded(
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Text(
                DurationFormatter.formatTimeframeDuration(
                    currentBrief.timeframeDuration),
                style: TextStyles.bodySm.copyWith(
                  color: Colors.white70,
                ),
              ),
            ),
            Text(
              currentBrief.topic.title,
              style: TextStyles.bodySm.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      );
    });
  }

  Widget _buildProgressBar() {
    return Obx(() {
      final playerState = controller.playerState.value;

      return PlayerSeekBar(
        progress: playerState.progress,
        position: playerState.position,
        duration: playerState.duration ?? Duration.zero,
        onSeek: controller.seek,
        hideTimeControls: true,
        disableDragSeek: true,
        seekBarHeight: 2.0,
        isGenerating: playerState.isGenerating,
      );
    });
  }

  Widget _buildControls(bool isPlaying) {
    return SizedBox(
      width: 48,
      height: 48,
      child: PlayerControlButton(
        onTap: () {
          unawaited(ReportingService.reportEvent(
            UserTapEvent(screen: Get.currentRoute, label: 'Toggle Play/Pause'),
          ));
          unawaited(controller.togglePlayPause());
        },
        isPlaying: isPlaying,
      ),
    );
  }
}
