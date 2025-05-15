import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/navbar/bottom_navbar.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/mini_player_navbar.dart';
import 'package:client_app/topics/widgets/topic_tile.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  const HomefeedPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<HomefeedController>();
    final topicsByCategory = controller.topics.value;
    final playerController = Get.find<PlayerController>();

    return Scaffold(
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          MiniPlayerNavbar(controller: playerController),
          BottomNavBar(
            currentIndex: 0,
            onTap: (index) {
              if (index == 0) {
                // Already on Homefeed, do nothing
              }
              // Implement navigation for other tabs when needed
            },
          ),
        ],
      ),
      body: DarkBackgroundLayout(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ...((topicsByCategory ?? {})
                  .entries
                  .map((entry) => [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Text(
                            entry.key,
                            style: TextStyles.headingLg,
                          ),
                        ),
                        const SizedBox(height: 28),
                        _buildTopicRow(entry.value),
                        const SizedBox(height: 20),
                      ])
                  .expand((widgetList) => widgetList)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopicRow(List<Topic> topics) {
    return SizedBox(
      height: 160,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        scrollDirection: Axis.horizontal,
        itemCount: topics.length,
        separatorBuilder: (_, __) => const SizedBox(width: 20),
        itemBuilder: (context, index) {
          final topic = topics[index];
          return TopicTile(
            title: topic.title,
            imageUrl: topic.thumbnailUrl,
          );
        },
      ),
    );
  }
}
