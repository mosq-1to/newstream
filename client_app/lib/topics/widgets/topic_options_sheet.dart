import 'dart:ui';

import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/pages/player_page.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/topics/topic_options_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class TopicOptionsSheet extends StatefulWidget {
  final String topicTitle;
  final String? topicImageUrl;

  const TopicOptionsSheet({
    super.key,
    required this.topicTitle,
    this.topicImageUrl,
  });

  @override
  State<TopicOptionsSheet> createState() => _TopicOptionsSheetState();
}

class _TopicOptionsSheetState extends State<TopicOptionsSheet> {
  int _selectedTimeframeIndex = 2; // Default to 15 minutes
  int _selectedLengthIndex = 0; // Default to 1 day

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
          if (widget.topicImageUrl != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: Image.network(
                widget.topicImageUrl!,
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
              widget.topicTitle,
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
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            children: [
              Text(
                "Timeframe",
                textAlign: TextAlign.center,
                style: TextStyles.bodySm.copyWith(color: Colors.grey.shade400),
              ),
              const SizedBox(height: 4),
              const Text(
                "How far should I reach?",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: Column(
            children: [
              Text(
                "Length",
                textAlign: TextAlign.center,
                style: TextStyles.bodySm.copyWith(color: Colors.grey.shade400),
              ),
              const SizedBox(height: 4),
              const Text(
                "How much time do you have?",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWheelPickers() {
    return SizedBox(
      height: 200,
      child: Row(
        children: [
          // Timeframe picker
          Expanded(
            child: CupertinoPicker(
              itemExtent: 40,
              backgroundColor: Colors.transparent,
              scrollController: FixedExtentScrollController(
                  initialItem: _selectedLengthIndex),
              onSelectedItemChanged: (int index) {
                setState(() {
                  _selectedLengthIndex = index;
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
          ),
          const Text(
            "in",
            style: TextStyle(color: Colors.grey),
          ),
          // Length picker
          Expanded(
            child: CupertinoPicker(
              itemExtent: 40,
              backgroundColor: Colors.transparent,
              scrollController: FixedExtentScrollController(
                  initialItem: _selectedTimeframeIndex),
              onSelectedItemChanged: (int index) {
                setState(() {
                  _selectedTimeframeIndex = index;
                });
              },
              children: TopicOptions.lengths
                  .map((length) => Center(
                        child: Text(
                          length.label,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                          ),
                        ),
                      ))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: InkWell(
        onTap: () async {
          // Handle play button pressed
          final selectedTimeframe =
              TopicOptions.timeframes[_selectedTimeframeIndex];
          final selectedLength = TopicOptions.lengths[_selectedLengthIndex];

          // Create a result object with the selected values
          final result = {
            'topicTitle': widget.topicTitle,
            'timeframe': selectedTimeframe,
            'length': selectedLength,
          };

          // Close the bottom sheet and return the selected values
          Navigator.of(context).pop(result);
          final playerController = Get.find<PlayerController>();
          await playerController.playExample();

          // Show the player page in full screen
          await PlayerPage.show(context);
        },
        child: Container(
          width: 64,
          height: 64,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFF232323),
          ),
          child: const Center(
            child: Icon(
              Icons.play_arrow,
              color: Colors.white,
              size: 36,
            ),
          ),
        ),
      ),
    );
  }
}
