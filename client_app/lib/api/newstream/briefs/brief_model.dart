class Brief {
  final String id;
  final String content;

  const Brief({
    required this.id,
    required this.content,
  });

  factory Brief.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'content': final String content,
      } =>
        Brief(
          id: id,
          content: content,
        ),
      _ => throw const FormatException('Failed to load Brief.'),
    };
  }
}
