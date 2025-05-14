import 'package:client_app/topics/mock_topics.dart';
import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:get/get.dart';

class NewstreamSearchController extends GetxController {
  final searchQuery = ''.obs;
  final RxList<Topic> searchResults = <Topic>[].obs;
  
  // Reference to the unified mock topics
  
  void onSearchQueryChanged(String query) {
    searchQuery.value = query;
    
    // Only show results after typing at least 2 characters
    if (query.length >= 2) {
  searchResults.value = MockTopics.topicsByCategory.values
      .expand((list) => list)
      .where((topicData) => topicData.title.toLowerCase().contains(query.toLowerCase()))
      .toList();
} else {
  searchResults.clear();
}
  }
  
  void clearSearch() {
    searchQuery.value = '';
    searchResults.clear();
  }
}
