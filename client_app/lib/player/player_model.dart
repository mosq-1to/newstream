import 'package:client_app/api/newstream/models/brief_model.dart';

class PlayerState {
  final bool isPlaying;
  final bool isProcessing;
  final bool isGenerating;
  final bool isBuffering;
  final Brief? currentBrief;
  final Duration position;
  final Duration? duration;

  const PlayerState({
    this.isPlaying = false,
    this.isProcessing = false,
    this.isGenerating = false,
    this.isBuffering = false,
    this.currentBrief,
    this.position = Duration.zero,
    this.duration,
  });

  PlayerState copyWith({
    bool? isPlaying,
    bool? isProcessing,
    bool? isGenerating,
    bool? isBuffering,
    double? progress,
    Brief? currentBrief,
    Duration? position,
    Duration? duration,
  }) {
    return PlayerState(
      isPlaying: isPlaying ?? this.isPlaying,
      isProcessing: isProcessing ?? this.isProcessing,
      isGenerating: isGenerating ?? this.isGenerating,
      isBuffering: isBuffering ?? this.isBuffering,
      currentBrief: currentBrief ?? this.currentBrief,
      position: position ?? this.position,
      duration: duration ?? this.duration,
    );
  }

  double get progress {
    // hide the bug with reinitializing seek bar
    final shouldShowTheBar = position.inMilliseconds >= 300;

    if (isGenerating && currentBrief != null) {
      return position.inMicroseconds /
          currentBrief!.targetDuration.inMicroseconds;
    }

    if (!shouldShowTheBar || duration == null || duration == Duration.zero) {
      return 0.0;
    }
    return position.inMilliseconds / duration!.inMilliseconds;
  }
}
