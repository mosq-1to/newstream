import 'dart:developer' as developer;

import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';
import 'package:just_audio/just_audio.dart' as audio;

class PlayerController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();
  final Rx<PlayerState> playerState = const PlayerState().obs;
  final audio.AudioPlayer _audioPlayer = audio.AudioPlayer();

  Future<void> togglePlayPause() async {
    try {
      if (playerState.value.isPlaying) {
        await _audioPlayer.pause();
      } else {
        await _audioPlayer.play();
      }

      playerState.value = playerState.value.copyWith(
        isPlaying: !playerState.value.isPlaying,
      );
    } catch (e) {
      developer.log('Error toggling play/pause: $e');
    }
  }

  void updateProgress(double progress) {
    playerState.value = playerState.value.copyWith(
      progress: progress,
    );
  }

  @override
  void onInit() {
    super.onInit();

    // Set up error handling for the audio player
    _audioPlayer.playbackEventStream.listen(
      (event) {},
      onError: (Object e, StackTrace st) {
        developer.log('Audio player error: $e');
        developer.log('Stack trace: $st');

        // Update player state on error
        playerState.value = playerState.value.copyWith(
          isPlaying: false,
        );
      },
    );
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
        isPlaying: false,
        progress: 0.0,
        currentStory: story,
        playlistUrl: null,
      );

        try {
          final playlistUrl = await _newstreamApi.getStoryStreamPlaylistUrl(
              story.id);
          developer.log('Trying HLS with setUrl: $playlistUrl');

          await _audioPlayer.setUrl(playlistUrl);
          await _audioPlayer.play();

          playerState.value = playerState.value.copyWith(
            playlistUrl: playlistUrl,
          );

          developer.log('Successfully playing with HLS setUrl');
        } catch (e) {
          developer.log('Error playing with HLS setUrl: $e');
        }


      // Listen to player state changes
      _audioPlayer.playerStateStream.listen((playerState) {
        developer.log('Player state changed: ${playerState.processingState}');

        // Update isPlaying based on player state
        this.playerState.value = this.playerState.value.copyWith(
          isPlaying: playerState.playing,
        );
      });

      // Listen to position changes
      _audioPlayer.positionStream.listen((position) {
        final duration = _audioPlayer.duration;
        if (duration != null && duration.inMilliseconds > 0) {
          final progress = position.inMilliseconds / duration.inMilliseconds;
          updateProgress(progress);
        }
      });

      // Update player state
      playerState.value = playerState.value.copyWith(
        isPlaying: true,
      );
    } catch (e, st) {
      developer.log('Error playing story: $e');
      developer.log('Stack trace: $st');

      // Handle error gracefully
      playerState.value = playerState.value.copyWith(
        isPlaying: false,
      );
    }
  }
}
