class Topic {
  final String id;
  final String title;
  final String thumbnailUrl;

  const Topic({
    required this.id,
    required this.title,
    required this.thumbnailUrl,
  });

  factory Topic.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'title': final String title,
        'thumbnailUrl': final String thumbnailUrl,
      } =>
        Topic(
          id: id,
          title: title,
          thumbnailUrl: thumbnailUrl,
        ),
      _ => throw const FormatException('Failed to load Topic.'),
    };
  }
}
