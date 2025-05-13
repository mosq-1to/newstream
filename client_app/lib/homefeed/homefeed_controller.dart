import 'package:client_app/homefeed/topic_tile_data.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/topics/mock_topics.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  // Reference to the unified mock topics data

  Map<String, List<TopicTileData>> fetchTopics() {
    // In a real app, this would fetch from an API
    return MockTopics.topicsByCategory;
  }

  final PlayerController _playerController;

  HomefeedController({required PlayerController playerController})
      : _playerController = playerController;
}
