import 'package:client_app/common/theme/text_styles.dart';
import 'package:flutter/material.dart';

class TopicTile extends StatelessWidget {
  final String title;
  final String? imageUrl;

  const TopicTile({
    Key? key,
    required this.title,
    this.imageUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Image or placeholder container
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: imageUrl != null && imageUrl!.isNotEmpty
              ? Image.network(
                  imageUrl!,
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
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: TextStyles.bodyXs,
          ),
        ),
      ],
    );
  }

  Widget _buildPlaceholderContainer() {
    return Container(
      width: 100,
      height: 100,
      color: const Color(0xFF232323),
    );
  }
}
