import 'package:client_app/api/newstream/stories/story_model.dart';

class PlayerState {
  final bool isPlaying;
  final double progress;
  final Story? currentStory;
  final String? playlistUrl;

  const PlayerState({
    this.isPlaying = false,
    this.progress = 0.0,
    this.currentStory,
    this.playlistUrl,
  });

  PlayerState copyWith({
    bool? isPlaying,
    double? progress,
    Story? currentStory,
    String? playlistUrl,
  }) {
    return PlayerState(
      isPlaying: isPlaying ?? this.isPlaying,
      progress: progress ?? this.progress,
      currentStory: currentStory ?? this.currentStory,
      playlistUrl: playlistUrl ?? this.playlistUrl,
    );
  }
}
