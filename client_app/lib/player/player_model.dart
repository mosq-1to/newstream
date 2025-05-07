import 'package:client_app/api/newstream/stories/story_model.dart';

class PlayerState {
  final bool isPlaying;
  final bool isProcessing;
  final double progress;
  final Story? currentStory;
  final Duration position;
  final Duration? duration;

  const PlayerState({
    this.isPlaying = false,
    this.isProcessing = false,
    this.progress = 0.0,
    this.currentStory,
    this.position = Duration.zero,
    this.duration,
  });

  PlayerState copyWith({
    bool? isPlaying,
    bool? isProcessing,
    double? progress,
    Story? currentStory,
    Duration? position,
    Duration? duration,
  }) {
    return PlayerState(
      isPlaying: isPlaying ?? this.isPlaying,
      isProcessing: isProcessing ?? this.isProcessing,
      progress: progress ?? this.progress,
      currentStory: currentStory ?? this.currentStory,
      position: position ?? this.position,
      duration: duration ?? this.duration,
    );
  }
}
