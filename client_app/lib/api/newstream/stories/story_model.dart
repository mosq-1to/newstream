class Story {
  final String id;
  final String title;
  final String content;
  final String thumbnailUrl;

  const Story({
    required this.id,
    required this.title,
    required this.content,
    required this.thumbnailUrl,
  });

  factory Story.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'title': final String title,
        'content': final String content,
        'thumbnailUrl': final String thumbnailUrl,
      } =>
        Story(
          id: id,
          title: title,
          content: content,
          thumbnailUrl: thumbnailUrl,
        ),
      _ => throw const FormatException('Failed to load Story.'),
    };
  }
}
