import 'package:get/get.dart';

class NewstreamSearchController extends GetxController {
  final searchQuery = ''.obs;
  final RxList<String> searchResults = <String>[].obs;
  
  // Mock topics for search results
  final List<String> mockTopics = [
    'Mental health',
    'Meditation',
    'Mindfulness',
    'Diet',
    'Nutrition',
    'Healthy eating',
    'Running',
    'Jogging',
    'Marathon training',
    'Yoga',
    'Pilates',
    'Fitness',
    'Weight loss',
    'Personal growth',
    'Self care',
    'Productivity'
  ];
  
  void onSearchQueryChanged(String query) {
    searchQuery.value = query;
    
    // Only show results after typing at least 2 characters
    if (query.length >= 2) {
      searchResults.value = mockTopics
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
