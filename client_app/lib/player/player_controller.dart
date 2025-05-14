import 'dart:developer' as developer;

import 'package:audio_session/audio_session.dart';
import 'package:client_app/api/newstream/models/brief_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/player/player_model.dart';
import 'package:flutter/material.dart';
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

  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
  }

  @override
  Future<void> onInit() async {
    super.onInit();

    // Initialize audio background service
    await JustAudioBackground.init(
      androidNotificationChannelId: 'pl.newstream.client_app.channel.audio',
      androidNotificationChannelName: 'Newstream Audio',
      androidNotificationOngoing: true,
      androidShowNotificationBadge: true,
    );

    _audioPlayer.errorStream.listen(_handleError);

    // Listen to player state changes
    _audioPlayer.playerStateStream.listen((playerState) {
      final isProcessing = !playerState.playing &&
          playerState.processingState == audio.ProcessingState.loading;

      this.playerState.value = this.playerState.value.copyWith(
            isPlaying: playerState.playing && !isProcessing,
            isProcessing: isProcessing,
          );

      if (playerState.processingState == audio.ProcessingState.completed) {
        _audioPlayer.seek(Duration.zero);
        _audioPlayer.pause();
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
  }

  @override
  void onClose() {
    _audioPlayer.dispose();
    super.onClose();
  }

  Future<void> playBrief(Brief brief) async {
    try {
      await _audioPlayer.stop();
      playerState.value = PlayerState(
        currentBrief: brief,
        isProcessing: true,
      );
      final playlistUrl =
          await _newstreamApi.getBriefStreamPlaylistUrl(brief.id);
      final mediaItem = MediaItem(
        id: brief.id,
        title: 'Brief',
      );
      final audioSource = audio.AudioSource.uri(
        Uri.parse(playlistUrl),
        tag: mediaItem,
      );
      final session = await AudioSession.instance;
      await session.configure(const AudioSessionConfiguration.speech());
      await _audioPlayer.setAudioSource(audioSource);

      return _audioPlayer.play();
    } catch (e) {
      _handleError(e);
    }
  }

  void _handleError(Object e) {
    developer.log('[PlayerController Error] $e');

    playerState.value = playerState.value.copyWith(
      isPlaying: false,
      isProcessing: false,
    );
  }
}
