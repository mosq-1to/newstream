import 'dart:developer' as developer;

import 'package:audio_session/audio_session.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/player/player_model.dart';
import 'package:get/get.dart';
import 'package:just_audio/just_audio.dart' as audio;
import 'package:just_audio_background/just_audio_background.dart';

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
  void onInit() async {
    super.onInit();

    // Configure audio session for proper handling of audio focus
    final session = await AudioSession.instance;
    await session.configure(const AudioSessionConfiguration.speech());

    // Set up error handling for the audio player
    _audioPlayer.playbackEventStream.listen(
      (event) {},
      onError: (Object e, StackTrace st) {
        developer.log('Audio player error: $e');
        developer.log('Stack trace: $st');

        // Update player state on error
        playerState.value = playerState.value.copyWith(
          isPlaying: false,
          isProcessing: false,
        );
      },
    );

    // Listen to player state changes
    _audioPlayer.playerStateStream.listen((playerState) {
      final isProcessing = !playerState.playing &&
          playerState.processingState == audio.ProcessingState.loading;

      this.playerState.value = this.playerState.value.copyWith(
            isPlaying: playerState.playing && !isProcessing,
            isProcessing: isProcessing,
          );

      if (playerState.processingState == audio.ProcessingState.completed) {
        this.playerState.value = this.playerState.value.copyWith(
              isPlaying: false,
              isProcessing: false,
            );
      }
    });

    // Listen to position changes
    _audioPlayer.positionStream.listen((position) {
      playerState.value = playerState.value.copyWith(
        position: position,
      );
    });

    // Listen to duration changes
    _audioPlayer.durationStream.listen((duration) {
      if (duration != null) {
        playerState.value = playerState.value.copyWith(
          duration: duration,
        );
      }
    });

    // Handle interruptions and audio focus changes
    session.interruptionEventStream.listen((event) {
      if (event.begin) {
        _audioPlayer.pause();
      } else {
        // Interruption ended
        switch (event.type) {
          case AudioInterruptionType.duck:
          case AudioInterruptionType.pause:
          case AudioInterruptionType.unknown:
            // Resume playback if it was playing before
            if (playerState.value.isPlaying) {
              _audioPlayer.play();
            }
            break;
        }
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

      // Update player state to show loading with processing indicator
      playerState.value = PlayerState(
        currentStory: story,
        isProcessing: true,
      );

      final playlistUrl =
          await _newstreamApi.getStoryStreamPlaylistUrl(story.id);

      // Create a MediaItem for the notification
      final mediaItem = MediaItem(
        id: story.id,
        title: story.title,
        artUri: Uri.parse(story.thumbnailUrl),
        displayTitle: story.title,
        displaySubtitle: 'Newstream Audio',
        displayDescription: story.content.length > 100
            ? '${story.content.substring(0, 100)}...'
            : story.content,
      );

      // Set the audio source with the MediaItem
      final audioSource = audio.AudioSource.uri(
        Uri.parse(playlistUrl),
        tag: mediaItem,
      );

      await _audioPlayer.setAudioSource(audioSource);
      await _audioPlayer.play();
    } catch (e) {
      developer.log('Error playing story: $e');

      // Handle error gracefully
      playerState.value = playerState.value.copyWith(
        isPlaying: false,
        isProcessing: false,
      );
    }
  }
}
