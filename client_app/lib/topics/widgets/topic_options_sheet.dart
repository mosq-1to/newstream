import 'dart:async';
import 'dart:ui';

import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/reporting_service.dart';
import 'package:client_app/common/analytics/analytics_event.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/pages/player_page.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_control_button.dart';
import 'package:client_app/topics/topic_options_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class TopicOptionsSheet extends StatefulWidget {
  final Topic topic;

  const TopicOptionsSheet({
    super.key,
    required this.topic,
  });

  @override
  State<TopicOptionsSheet> createState() => _TopicOptionsSheetState();
}

class _TopicOptionsSheetState extends State<TopicOptionsSheet> {
  int _selectedTimeframeIndex = 1; // Default to 1 week
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Blurred background
        Positioned.fill(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
            child: Container(
              color: Colors.black.withValues(
                alpha: 0.8,
              ), // Optional: darken blurred background
            ),
          ),
        ),
        // The actual sheet content
        Container(
          decoration: const BoxDecoration(
            color: Color.fromARGB(255, 0, 0, 0),
            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildDragHandle(),
              _buildTopicHeader(),
              const SizedBox(height: 28),
              _buildPickerSelectionRow(),
              _buildWheelPickers(),
              _buildPlayButton(),
              SizedBox(height: MediaQuery.of(context).padding.bottom + 16),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDragHandle() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Container(
        width: 36,
        height: 4,
        decoration: BoxDecoration(
          color: Colors.grey.shade600,
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    );
  }

  Widget _buildTopicHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          if (widget.topic.thumbnailUrl.isNotEmpty)
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: Image.network(
                widget.topic.thumbnailUrl,
                width: 48,
                height: 48,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 48,
                  height: 48,
                  color: const Color.fromARGB(255, 35, 35, 35),
                ),
              ),
            ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              widget.topic.title,
              style: TextStyles.headingMd.copyWith(color: Colors.white),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPickerSelectionRow() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          Text(
            "How much you want to learn?",
            textAlign: TextAlign.center,
            style: TextStyles.bodySm.copyWith(color: Colors.grey.shade400),
          ),
        ],
      ),
    );
  }

  Widget _buildWheelPickers() {
    return SizedBox(
      height: 200,
      child: CupertinoPicker(
        itemExtent: 40,
        backgroundColor: Colors.transparent,
        scrollController:
            FixedExtentScrollController(initialItem: _selectedTimeframeIndex),
        onSelectedItemChanged: (int index) {
          setState(() {
            _selectedTimeframeIndex = index;
          });
        },
        children: TopicOptions.timeframes
            .map((timeframe) => Center(
                  child: Text(
                    timeframe.label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                ))
            .toList(),
      ),
    );
  }

  Widget _buildPlayButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: PlayerControlButton(
        // todo - move the logic to dedicated controller
        onTap: _isLoading
            ? null
            : () async {
                setState(() => _isLoading = true);
                final selectedTimeframe =
                    TopicOptions.timeframes[_selectedTimeframeIndex];

                // Create a result object with the selected values
                final result = {
                  'topicTitle': widget.topic.title,
                  'timeframe': selectedTimeframe,
                };

                unawaited(ReportingService.reportEvent(
                  UserTapEvent(
                    screen: 'TopicOptions',
                    label: 'Generate brief',
                  ),
                ));

                try {
                  final brief = await Get.find<NewstreamApi>().createBrief(
                    widget.topic.id,
                    selectedTimeframe.duration.inDays,
                  );
                  final playerController = Get.find<PlayerController>();
                  Navigator.of(context).pop(result);
                  unawaited(PlayerPage.show(context));
                  unawaited(playerController.playBrief(brief));
                } catch (e, st) {
                  await ReportingService.reportError(
                    e,
                    st,
                    showToast: true,
                  );
                } finally {
                  setState(() => _isLoading = false);
                }
              },
        isPlaying: false,
        isLoading: _isLoading,
        size: 64,
      ),
    );
  }
}
