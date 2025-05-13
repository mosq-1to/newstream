import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/topics/topic_options_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class TopicOptionsSheet extends StatefulWidget {
  final String topicTitle;
  final String? topicImageUrl;

  const TopicOptionsSheet({
    Key? key,
    required this.topicTitle,
    this.topicImageUrl,
  }) : super(key: key);

  @override
  State<TopicOptionsSheet> createState() => _TopicOptionsSheetState();
}

class _TopicOptionsSheetState extends State<TopicOptionsSheet> {
  int _selectedTimeframeIndex = 2; // Default to 15 minutes
  int _selectedLengthIndex = 0; // Default to 1 day

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF121212),
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildDragHandle(),
          _buildTopicHeader(),
          const SizedBox(height: 16),
          _buildPickerSelectionRow(),
          _buildWheelPickers(),
          _buildPlayButton(),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 16),
        ],
      ),
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
                width: 32,
                height: 32,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 32,
                  height: 32,
                  color: const Color(0xFF232323),
                ),
              ),
            ),
          if (widget.topicImageUrl != null) const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.topicTitle,
              style: TextStyles.headingSm.copyWith(color: Colors.white),
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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              "Timeframe",
              textAlign: TextAlign.center,
              style: TextStyles.bodySm.copyWith(color: Colors.grey.shade400),
            ),
          ),
          Expanded(
            child: Text(
              "Length",
              textAlign: TextAlign.center,
              style: TextStyles.bodySm.copyWith(color: Colors.grey.shade400),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWheelPickers() {
    return SizedBox(
      height: 200,
      child: Row(
        children: [
          // Length picker
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
              children: TopicOptions.lengths
                  .map((length) => Center(
                        child: Text(
                          length.label,
                          style: TextStyles.body.copyWith(color: Colors.white),
                        ),
                      ))
                  .toList(),
            ),
          ),
          const Text(
            "in",
            style: TextStyle(color: Colors.grey),
          ),
          // Timeframe picker
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
              children: TopicOptions.timeframes
                  .map((timeframe) => Center(
                        child: Text(
                          timeframe.label,
                          style: TextStyles.body.copyWith(color: Colors.white),
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
        onTap: () {
          // Handle play button pressed
          final selectedTimeframe =
              TopicOptions.timeframes[_selectedTimeframeIndex];
          final selectedLength = TopicOptions.lengths[_selectedLengthIndex];

          // Close the bottom sheet and return the selected values
          Navigator.of(context).pop({
            'topicTitle': widget.topicTitle,
            'timeframe': selectedTimeframe,
            'length': selectedLength,
          });
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
