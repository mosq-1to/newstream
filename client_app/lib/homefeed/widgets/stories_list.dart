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
          padding: const EdgeInsets.only(bottom: 16),
          child: Column(
            children: [
              Text(
                story.title,
                style: TextStyles.body,
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
