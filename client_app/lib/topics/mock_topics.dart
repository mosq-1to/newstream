import 'package:client_app/homefeed/topic_tile_data.dart';

class MockTopics {
  static List<String> getAllTopicTitles() {
    final Set<String> uniqueTitles = {};

    for (final categoryTopics in topicsByCategory.values) {
      for (final topic in categoryTopics) {
        uniqueTitles.add(topic.title);
      }
    }

    return uniqueTitles.toList();
  }

  static const Map<String, List<TopicTileData>> topicsByCategory = {
    'Trending topics': [
      TopicTileData(
        title: 'Stock markets',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      TopicTileData(
        title: 'Artificial Intelligence',
        imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      TopicTileData(
        title: 'Politics',
        imageUrl:
            'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      ),
      TopicTileData(
        title: 'Stock markets',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
    ],
    'Technology': [
      TopicTileData(
        title: 'Front-end programming',
        imageUrl:
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
      TopicTileData(
        title: 'Artificial Intelligence',
        imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      TopicTileData(
        title: 'Mobile development',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      TopicTileData(
        title: 'Front-end programming',
        imageUrl:
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
    ],
    'Health': [
      TopicTileData(
        title: 'Nutrition',
        imageUrl:
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
      TopicTileData(
        title: 'Mental Health',
        imageUrl:
            'https://images.unsplash.com/photo-1503676382389-4809596d5290',
      ),
      TopicTileData(
        title: 'Fitness',
        imageUrl:
            'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
      ),
      TopicTileData(
        title: 'Nutrition',
        imageUrl:
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
    ],
  };
}
