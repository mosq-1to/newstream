class Story {
  final String id;
  final String title;
  final String url;
  final String content;

  const Story({
    required this.id,
    required this.title,
    required this.url,
    required this.content,
  });

  factory Story.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'title': final String title,
        'url': final String url,
        'content': final String content,
      } =>
        Story(
          id: id,
          title: title,
          url: url,
          content: content,
        ),
      _ => throw const FormatException('Failed to load Story.'),
    };
  }
}
