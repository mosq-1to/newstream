import 'package:client_app/homefeed/topic_tile_data.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  // Mocked topics data
  final Map<String, List<TopicTileData>> topicsByCategory = {
    'Trending topics': [
      const TopicTileData(
        title: 'Stock markets',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      const TopicTileData(
        title: 'Artificial Intelligence',
        imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      const TopicTileData(
        title: 'Politics',
        imageUrl:
            'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      ),
      const TopicTileData(
        title: 'Stock markets',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
    ],
    'Technology': [
      const TopicTileData(
        title: 'Front-end programming',
        imageUrl:
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
      const TopicTileData(
        title: 'Artificial Intelligence',
        imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      const TopicTileData(
        title: 'Mobile development',
        imageUrl:
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      const TopicTileData(
        title: 'Front-end programming',
        imageUrl:
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
    ],
    'Health': [
      const TopicTileData(
        title: 'Nutrition',
        imageUrl:
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
      const TopicTileData(
        title: 'Mental Health',
        imageUrl:
            'https://images.unsplash.com/photo-1503676382389-4809596d5290',
      ),
      const TopicTileData(
        title: 'Fitness',
        imageUrl:
            'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
      ),
      const TopicTileData(
        title: 'Nutrition',
        imageUrl:
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
    ],
  };

  Map<String, List<TopicTileData>> fetchTopics() {
    // In a real app, this would fetch from an API
    return topicsByCategory;
  }

  final PlayerController _playerController;

  HomefeedController({required PlayerController playerController})
      : _playerController = playerController;
}
