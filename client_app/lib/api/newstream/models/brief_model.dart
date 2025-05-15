import 'package:client_app/api/newstream/models/article_model.dart';
import 'package:client_app/api/newstream/models/topic_model.dart';

class Brief {
  final String id;
  final String content;
  final Topic topic;
  final Duration targetDuration;
  final List<Article> articles;

  const Brief({
    required this.id,
    required this.content,
    required this.topic,
    required this.targetDuration,
    required this.articles,
  });

  factory Brief.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'content': final String content,
        'topic': final Map<String, dynamic> topic,
        'articles': final List<dynamic> articles,
      } =>
        Brief(
          id: id,
          content: content,
          topic: Topic.fromJson(topic),
          // todo - move to the real entity
          targetDuration: const Duration(minutes: 5),
          articles: articles
              .map((article) =>
                  Article.fromJson(article as Map<String, dynamic>))
              .toList(),
        ),
      _ => throw const FormatException('Failed to load Brief.'),
    };
  }
}
