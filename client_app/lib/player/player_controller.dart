import 'dart:developer' as developer;

import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';
import 'package:just_audio/just_audio.dart' as audio;

/// TODO
/// - add processing state which will be used after clicking and before playing has started

class PlayerController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();
  final Rx<PlayerState> playerState = const PlayerState().obs;
  final audio.AudioPlayer _audioPlayer = audio.AudioPlayer();

  Future<void> togglePlayPause() async {
    if (_audioPlayer.playing) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.play();
    }
  }

  @override
  void onInit() {
    super.onInit();

    // Set up error handling for the audio player
    _audioPlayer.playbackEventStream.listen(
      (event) {},
      onError: (Object e, StackTrace st) {
        print('Audio player error: $e');
        print('Stack trace: $st');
      },
    );

    // Listen to player state changes
    _audioPlayer.playerStateStream.listen((playerState) {
      this.playerState.value = this.playerState.value.copyWith(
            isPlaying: playerState.playing,
          );
    });

    // Listen to position changes
    _audioPlayer.positionStream.listen((position) {
      final duration = _audioPlayer.duration;
      if (duration != null && duration.inMilliseconds > 0) {
        final progress = position.inMilliseconds / duration.inMilliseconds;
        playerState.value = playerState.value.copyWith(
          progress: progress,
        );
      }
    });
  }

  @override
  void onClose() {
    _audioPlayer.dispose();
    super.onClose();
  }

  Future<void> playStory(Story story) async {
    try {
      // Stop any currently playing audio
      await _audioPlayer.stop();

      // Update player state to show loading
      playerState.value = PlayerState(
        currentStory: story,
      );

      final playlistUrl =
          await _newstreamApi.getStoryStreamPlaylistUrl(story.id);

      await _audioPlayer.setUrl(playlistUrl);
      await _audioPlayer.play();
    } catch (e) {
      print('Error playing story: $e');

      // Handle error gracefully
      playerState.value = playerState.value.copyWith(
        isPlaying: false,
      );
    }
  }
}
