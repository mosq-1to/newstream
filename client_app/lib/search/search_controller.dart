import 'package:client_app/topics/mock_topics.dart';
import 'package:get/get.dart';

class NewstreamSearchController extends GetxController {
  final searchQuery = ''.obs;
  final RxList<String> searchResults = <String>[].obs;
  
  // Reference to the unified mock topics
  
  void onSearchQueryChanged(String query) {
    searchQuery.value = query;
    
    // Only show results after typing at least 2 characters
    if (query.length >= 2) {
      searchResults.value = MockTopics.getAllTopicTitles()
          .where((topic) => topic.toLowerCase().contains(query.toLowerCase()))
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
