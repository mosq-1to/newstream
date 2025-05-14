import 'package:client_app/api/newstream/models/topic_model.dart';

class MockTopics {
  static List<String> getAllTopicTitles() {
    final Set<String> uniqueTitles = {};

    for (final categoryTopics in topicsByCategory.values) {
      for (final topic in categoryTopics) {
        uniqueTitles.add(topic.title);
      }
    }

    return uniqueTitles.toList();
  }

  static final Map<String, List<Topic>> topicsByCategory = {
    'Trending topics': [
      Topic(
        id: 'mock-stock-markets',
        title: 'Stock markets',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      Topic(
        id: 'mock-artificial-intelligence',
        title: 'Artificial Intelligence',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      Topic(
        id: 'mock-politics',
        title: 'Politics',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      ),
      Topic(
        id: 'mock-stock-markets-2',
        title: 'Stock markets',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
    ],
    'Technology': [
      Topic(
        id: 'mock-front-end-programming',
        title: 'Front-end programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
      Topic(
        id: 'mock-artificial-intelligence-2',
        title: 'Artificial Intelligence',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      ),
      Topic(
        id: 'mock-mobile-development',
        title: 'Mobile development',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      ),
      Topic(
        id: 'mock-front-end-programming-2',
        title: 'Front-end programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      ),
    ],
    'Health': [
      Topic(
        id: 'mock-nutrition',
        title: 'Nutrition',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
      Topic(
        id: 'mock-mental-health',
        title: 'Mental Health',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290',
      ),
      Topic(
        id: 'mock-fitness',
        title: 'Fitness',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
      ),
      Topic(
        id: 'mock-nutrition-2',
        title: 'Nutrition',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ),
    ],
  };


}
