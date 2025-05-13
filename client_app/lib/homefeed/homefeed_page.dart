import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:flutter/material.dart';

class HomefeedPage extends StatelessWidget {
  const HomefeedPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: DarkBackgroundLayout(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Trending topics',
                  style: TextStyles.headingLg,
                ),
              ),
              const SizedBox(height: 28),
              _buildTopicRow([
                const _TopicTileData(
                  title: 'Stock markets',
                  imageUrl:
                      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
                ),
                const _TopicTileData(
                  title: 'Artificial Intelligence',
                  imageUrl:
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                ),
                const _TopicTileData(
                  title: 'Politics',
                  imageUrl:
                      'https://images.unsplash.com/photo-1464983953574-0892a716854b',
                ),
              ]),
              const SizedBox(height: 20),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Technology',
                  style: TextStyles.headingLg,
                ),
              ),
              const SizedBox(height: 28),
              _buildTopicRow([
                const _TopicTileData(
                  title: 'Front-end programming',
                  imageUrl:
                      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                ),
                const _TopicTileData(
                  title: 'Artificial Intelligence',
                  imageUrl:
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                ),
                const _TopicTileData(
                  title: 'Mobile development',
                  imageUrl:
                      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
                ),
              ]),
              const SizedBox(height: 20),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Health',
                  style: TextStyles.headingLg,
                ),
              ),
              const SizedBox(height: 28),
              _buildTopicRow([
                const _TopicTileData(
                  title: 'Nutrition',
                  imageUrl:
                      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
                ),
                const _TopicTileData(
                  title: 'Mental Health',
                  imageUrl:
                      'https://images.unsplash.com/photo-1503676382389-4809596d5290',
                ),
                const _TopicTileData(
                  title: 'Fitness',
                  imageUrl:
                      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
                ),
              ]),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopicRow(List<_TopicTileData> topics) {
    return SizedBox(
      height: 160,
      child: ListView.separated(
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

class _TopicTileData {
  final String title;
  final String imageUrl;
  const _TopicTileData({required this.title, required this.imageUrl});
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
