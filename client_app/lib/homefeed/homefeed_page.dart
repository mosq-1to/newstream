import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/homefeed/widgets/stories_list.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final controller = Get.find<HomefeedController>();

    return Scaffold(
      body: DarkBackgroundLayout(
        child: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 42),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(bottom: 36),
                    child: Text(
                      'Recent stories',
                      style: TextStyles.headingLg,
                    ),
                  ),
                  Obx(() => StoriesList(
                        stories: controller.stories.toList(),
                        onStoryTap: controller.openStory,
                      )),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
