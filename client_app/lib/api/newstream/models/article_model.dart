class Article {
  final String id;
  final String title;
  final String content;
  final String thumbnailUrl;
  final String url;

  const Article({
    required this.id,
    required this.title,
    required this.content,
    required this.thumbnailUrl,
    required this.url,
  });

  factory Article.fromJson(Map<String, dynamic> json) => switch (json) {
        {
          'id': final String id,
          'title': final String title,
          'content': final String content,
          'thumbnailUrl': final String thumbnailUrl,
          'url': final String url,
        } =>
          Article(
            id: id,
            title: title,
            content: content,
            thumbnailUrl: thumbnailUrl,
            url: url,
          ),
        _ => throw const FormatException('Failed to load Article.'),
      };
}
