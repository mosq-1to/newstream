class Topic {
  final String id;
  final String title;
  final String thumbnailUrl;
  final String categoryTitle;

  const Topic({
    required this.id,
    required this.title,
    required this.thumbnailUrl,
    required this.categoryTitle,
  });

  factory Topic.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'title': final String title,
        'thumbnailUrl': final String thumbnailUrl,
        'categoryTitle': final String categoryTitle,
      } =>
        Topic(
          id: id,
          title: title,
          thumbnailUrl: thumbnailUrl,
          categoryTitle: categoryTitle,
        ),
      _ => throw const FormatException('Failed to load Topic.'),
    };
  }
}
