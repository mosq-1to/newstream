String formatDuration(Duration? duration) {
  if (duration == null) {
    return '--:--';
  }
  
  final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
  final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
  
  return '$minutes:$seconds';
}
