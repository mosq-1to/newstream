import 'package:client_app/api/newstream/models/brief_model.dart';
import 'package:client_app/api/newstream/models/topic_model.dart';

class MockPlayerData {
  static final Brief mockBrief = const Brief(
    id: 'mock-brief-001',
    content: 'Artificial Intelligence',
    topic: Topic(
      id: 'mock-topic-001',
      title: 'Artificial Intelligence',
      thumbnailUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    ),
  );
}
