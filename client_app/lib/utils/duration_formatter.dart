// ignore_for_file: avoid_classes_with_only_static_members

class DurationFormatter {
  static String formatTimeframeDuration(Duration duration) {
    final days = duration.inDays;

    // Handle month
    if (days >= 30) {
      final months = days ~/ 30;
      return months == 1 ? '1 month of' : '$months months of';
    }

    // Handle weeks
    if (days >= 7 && days % 7 == 0) {
      final weeks = days ~/ 7;
      return weeks == 1 ? '1 week of' : '$weeks weeks of';
    }

    // Handle days
    return days == 1 ? '1 day of' : '$days days of';
  }
}
