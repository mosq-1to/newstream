import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/ui/tappable.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/homefeed/widgets/stories_list_entry.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final controller = Get.find<HomefeedController>();

    return Scaffold(
      body: DarkBackgroundLayout(
        child: Padding(
          padding: const EdgeInsets.only(top: 42),
          child: Obx(
            () => ListView(
              children: [
                const Text(
                  'Recent stories',
                  style: TextStyles.headingLg,
                ),
                const SizedBox(height: 36),
                ...controller.stories.map((story) {
                  return Tappable(
                    onTap: () => controller.openStory(story),
                    child: StoriesListEntry(
                      title: story.title,
                      thumbnailUrl: story.thumbnailUrl,
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
