import 'package:client_app/common/theme/text_styles.dart';
import 'package:flutter/material.dart';

class StoriesListEntry extends StatelessWidget {
  final String title;
  final String thumbnailUrl;

  const StoriesListEntry({
    required this.title,
    required this.thumbnailUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 36),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          StoriesListEntryMeta(title: title),
          const SizedBox(width: 24),
          StoriesListEntryThumbnail(thumbnailUrl: thumbnailUrl),
        ],
      ),
    );
  }
}

class StoriesListEntryMeta extends StatelessWidget {
  final String title;

  const StoriesListEntryMeta({
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Text(
        overflow: TextOverflow.ellipsis,
        maxLines: 2,
        title,
        style: TextStyles.headingSm,
      ),
    );
  }
}

class StoriesListEntryThumbnail extends StatelessWidget {
  final String thumbnailUrl;

  const StoriesListEntryThumbnail({
    required this.thumbnailUrl,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 100,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Image.network(
          thumbnailUrl,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return const Center(
              child: Icon(
                Icons.image_not_supported,
                color: Colors.white,
              ),
            );
          },
        ),
      ),
    );
  }
}
