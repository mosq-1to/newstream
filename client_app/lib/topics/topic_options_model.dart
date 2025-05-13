class TopicTimeframe {
  final String label;
  final Duration duration;

  const TopicTimeframe({required this.label, required this.duration});
}

class TopicLength {
  final String label;
  final Duration duration;

  const TopicLength({required this.label, required this.duration});
}

class TopicOptions {
  static const List<TopicTimeframe> lengths = [
    TopicTimeframe(label: '5 minutes', duration: Duration(minutes: 5)),
    TopicTimeframe(label: '10 minutes', duration: Duration(minutes: 10)),
    TopicTimeframe(label: '15 minutes', duration: Duration(minutes: 15)),
    TopicTimeframe(label: '20 minutes', duration: Duration(minutes: 20)),
    TopicTimeframe(label: '45 minutes', duration: Duration(minutes: 45)),
    TopicTimeframe(label: '1 hour', duration: Duration(hours: 1)),
  ];

  static const List<TopicLength> timeframes = [
    TopicLength(label: '1 day', duration: Duration(days: 1)),
    TopicLength(label: '1 week', duration: Duration(days: 7)),
    TopicLength(label: '2 weeks', duration: Duration(days: 14)),
    TopicLength(label: '1 month', duration: Duration(days: 30)),
  ];
}
