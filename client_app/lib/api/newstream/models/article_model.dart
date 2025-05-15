class Article {
  final String id;
  final String title;
  final String content;
  final String thumbnailUrl;

  const Article({
    required this.id,
    required this.title,
    required this.content,
    required this.thumbnailUrl,
  });

  factory Article.fromJson(Map<String, dynamic> json) => switch (json) {
    {
      'id': final String id,
      'title': final String title,
      'content': final String content,
      'thumbnailUrl': final String thumbnailUrl,
    } => Article(
      id: id,
      title: title,
      content: content,
      thumbnailUrl: thumbnailUrl,
    ),
    _ => throw const FormatException('Failed to load Article.'),
  };
}
