import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/ui/tappable.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/homefeed/widgets/stories_list_entry.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  final ScrollController _scrollController = ScrollController();
  final controller = Get.find<HomefeedController>();

  HomefeedPage() {
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    final scrollPosition = _scrollController.position.pixels;
    final maxScrollExtent = _scrollController.position.maxScrollExtent;

    if (scrollPosition >= maxScrollExtent - 200) {
      controller.fetchMoreStories();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: DarkBackgroundLayout(
        child: Obx(
          () => ListView.builder(
            controller: _scrollController,
            itemCount: controller.stories.length + 1, // +1 for the header
            itemBuilder: (context, index) {
              if (index == 0) {
                return _buildRecentStoriesHeader();
              } else {
                final story = controller.stories[index - 1];
                return _buildStoryEntry(story, controller);
              }
            },
          ),
        ),
      ),
    );
  }

  Widget _buildRecentStoriesHeader() {
    return const Padding(
      padding: EdgeInsets.only(top: 24, bottom: 48),
      child: Text(
        'Recent stories',
        style: TextStyles.headingXl,
      ),
    );
  }

  Widget _buildStoryEntry(Story story, HomefeedController controller) {
    return Tappable(
      onTap: () => controller.openStory(story),
      child: StoriesListEntry(
        title: story.title,
        thumbnailUrl: story.thumbnailUrl,
      ),
    );
  }
}
