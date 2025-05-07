import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
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
