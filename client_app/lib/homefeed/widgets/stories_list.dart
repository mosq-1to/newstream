import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/homefeed/widgets/stories_list_entry.dart';
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
        return StoriesListEntry(
          title: story.title,
          thumbnailUrl: story.thumbnailUrl,
        );
      }).toList(),
    );
  }
}
