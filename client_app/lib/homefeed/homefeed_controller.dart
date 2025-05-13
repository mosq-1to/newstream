import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';
import 'package:client_app/homefeed/topic_tile_data.dart';

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

  final NewstreamApi _newstreamApi = Get.find();
  final PlayerController _playerController;
  final RxList<Story> stories = RxList<Story>([]);
  final RxInt currentPage = RxInt(0);
  final Rx<Story?> currentlyPlayedStory = Rx<Story?>(null);

  HomefeedController({required PlayerController playerController})
      : _playerController = playerController;

  @override
  Future<void> onInit() async {
    super.onInit();
    fetchStories();

    // Listen to changes in the player state
    ever(_playerController.playerState, _updateCurrentlyPlayedStory);
  }

  void _updateCurrentlyPlayedStory(PlayerState state) {
    currentlyPlayedStory.value = state.currentStory;
  }

  Future<void> fetchStories() async {
    stories.value = (await _newstreamApi.getStories()).take(10).toList();
  }

  Future<void> fetchMoreStories() async {
    //TODO Add real pagination
    final newStories = (await _newstreamApi.getStories())
        .skip(currentPage.value * 10)
        .take(10)
        .toList();

    if (newStories.isNotEmpty) {
      currentPage.value++;
      stories.value = [...stories, ...newStories];
    }
  }

  Future<void> openStory(Story story) async {
    // Play the story in the player
    await _playerController.playStory(story);
  }

  Story? getCurrentlyPlayedStory() {
    return currentlyPlayedStory.value;
  }
}
