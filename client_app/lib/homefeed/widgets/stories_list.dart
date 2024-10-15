import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/homefeed/widgets/stories_list_entry.dart';
import 'package:flutter/material.dart';

class StoriesList extends StatelessWidget {
  final List<Story> stories;
  final Function(Story) onStoryTap;

  const StoriesList({
    required this.stories,
    required this.onStoryTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: stories.map((story) {
        return GestureDetector(
          onTap: () {
            onStoryTap(story);
          },
          child: StoriesListEntry(
            title: story.title,
            thumbnailUrl: story.thumbnailUrl,
          ),
        );
      }).toList(),
    );
  }
}
