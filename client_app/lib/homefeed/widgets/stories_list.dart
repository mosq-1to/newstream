import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:flutter/material.dart';

class StoriesList extends StatelessWidget {
  final List<Story> stories;

  const StoriesList({
    required this.stories,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: stories.map((story) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 36),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 180,
                child: Text(
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                  story.title,
                  style: TextStyles.headingSm,
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: SizedBox(
                  height: 100,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      story.thumbnailUrl,
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
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
