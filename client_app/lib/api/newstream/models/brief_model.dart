import 'package:client_app/api/newstream/models/topic_model.dart';

class Brief {
  final String id;
  final String content;
  final Topic topic;

  const Brief({
    required this.id,
    required this.content,
    required this.topic,
  });

  factory Brief.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'content': final String content,
        'topic': final Map<String, dynamic> topic,
      } =>
        Brief(
          id: id,
          content: content,
          topic: Topic.fromJson(topic),
        ),
      _ => throw const FormatException('Failed to load Brief.'),
    };
  }
}
