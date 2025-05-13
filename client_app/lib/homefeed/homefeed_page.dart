import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/homefeed/topic_tile_data.dart';
import 'package:client_app/navbar/bottom_navbar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class HomefeedPage extends StatelessWidget {
  const HomefeedPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<HomefeedController>();
    final topicsByCategory = controller.fetchTopics();
    return Scaffold(
      bottomNavigationBar: BottomNavBar(
        currentIndex: 0,
        onTap: (index) {
          if (index == 0) {
            // Already on Homefeed, do nothing
          }
          // Implement navigation for other tabs when needed
        },
      ),
      body: DarkBackgroundLayout(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final entry in topicsByCategory.entries) ...[
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
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopicRow(List<TopicTileData> topics) {
    return SizedBox(
      height: 160,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        scrollDirection: Axis.horizontal,
        itemCount: topics.length,
        separatorBuilder: (_, __) => const SizedBox(width: 20),
        itemBuilder: (context, index) {
          final topic = topics[index];
          return _TopicTile(
            title: topic.title,
            imageUrl: topic.imageUrl,
          );
        },
      ),
    );
  }
}

class _TopicTile extends StatelessWidget {
  final String title;
  final String imageUrl;
  const _TopicTile({required this.title, required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.network(
            imageUrl,
            width: 100,
            height: 100,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                width: 100,
                height: 100,
                color: const Color.fromARGB(255, 20, 20, 20),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: 100,
          child: Text(
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: TextStyles.bodyXs,
          ),
        ),
      ],
    );
  }
}
