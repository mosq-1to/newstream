import 'package:cached_network_image/cached_network_image.dart';
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
          StoriesListEntryMeta(title: title, sourceName: 'The New York Times'),
          const SizedBox(width: 24),
          StoriesListEntryThumbnail(thumbnailUrl: thumbnailUrl),
        ],
      ),
    );
  }
}

class StoriesListEntryMeta extends StatelessWidget {
  final String title;
  final String sourceName;

  const StoriesListEntryMeta({
    required this.title,
    required this.sourceName,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            overflow: TextOverflow.ellipsis,
            maxLines: 3,
            title,
            style: TextStyles.headingSm,
          ),
          const SizedBox(height: 8),
          Text(
            overflow: TextOverflow.ellipsis,
            sourceName,
            style: TextStyles.bodySm.merge(
              const TextStyle(
                color: Color(0xFF575757),
              ),
            ),
          ),
        ],
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
        child: CachedNetworkImage(
          fadeInDuration: const Duration(milliseconds: 200),
          imageUrl: thumbnailUrl,
          fit: BoxFit.cover,
          errorWidget: (context, url, error) => const Center(
            child: Icon(
              Icons.image_not_supported,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
