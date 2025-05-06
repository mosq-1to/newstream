import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';

class PlayerController extends GetxController {
  final Rx<PlayerState> playerState = const PlayerState().obs;

  void togglePlayPause() {
    playerState.value = playerState.value.copyWith(
      isPlaying: !playerState.value.isPlaying,
    );
  }

  void updateProgress(double progress) {
    playerState.value = playerState.value.copyWith(
      progress: progress,
    );
  }

  void playStory(Story story) {
    playerState.value = PlayerState(
      isPlaying: true,
      progress: 0.5, // testing purposes
      currentStory: story,
    );
  }
}
