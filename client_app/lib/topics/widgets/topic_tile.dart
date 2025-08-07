import 'package:client_app/common/logger.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:client_app/common/ui/tappable.dart';
import 'package:client_app/topics/widgets/topic_options_sheet.dart';
import 'package:flutter/material.dart';

import 'package:client_app/api/newstream/models/topic_model.dart';

class TopicTile extends StatefulWidget {
  final Topic topic;

  const TopicTile({
    super.key,
    required this.topic,
  });

  @override
  State<TopicTile> createState() => _TopicTileState();
}

class _TopicTileState extends State<TopicTile> {
  @override
  Widget build(BuildContext context) {
    return Tappable(
      onTap: () => _showTopicOptionsSheet(context),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Image or placeholder container
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: widget.topic.thumbnailUrl.isNotEmpty
                ? Image.network(
                    widget.topic.thumbnailUrl,
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return _buildPlaceholderContainer();
                    },
                  )
                : _buildPlaceholderContainer(),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: 100,
            child: Text(
              widget.topic.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: TextStyles.bodyXs,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholderContainer() {
    return Container(
      width: 100,
      height: 100,
      color: const Color(0xFF232323),
    );
  }

  Future<void> _showTopicOptionsSheet(BuildContext context) async {
    try {
      await showModalBottomSheet(
        context: context,
        backgroundColor: Colors.transparent,
        isScrollControlled: true,
        builder: (context) => TopicOptionsSheet(
          topic: widget.topic,
        ),
      );
    } catch (e) {
      ToastService.showError('Something went wrong. Try again later');
      logger.e(
        '[Error] TopicTile._showTopicOptionsSheet',
        error: e,
      );
    }
  }
}
