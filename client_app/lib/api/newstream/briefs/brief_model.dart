class Brief {
  final String id;
  final String content;
  final String thumbnailUrl;

  const Brief({
    required this.id,
    required this.content,
    required this.thumbnailUrl,
  });

  factory Brief.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'content': final String content,
        'thumbnailUrl': final String thumbnailUrl,
      } =>
        Brief(
          id: id,
          content: content,
          thumbnailUrl: thumbnailUrl,
        ),
      _ => throw const FormatException('Failed to load Brief.'),
    };
  }
}
