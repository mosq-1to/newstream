import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:get/get.dart';

class NewstreamSearchController extends GetxController {
  final searchQuery = ''.obs;
  final RxList<Topic> searchResults = <Topic>[].obs;
  final NewstreamApi _newstreamApi = Get.find();

  Future<void> onSearchQueryChanged(String query) async {
    searchQuery.value = query;

    if (query.length >= 2) {
      searchResults.value = await _newstreamApi.fetchTopics();
    } else {
      searchResults.clear();
    }
  }

  void clearSearch() {
    searchQuery.value = '';
    searchResults.clear();
  }
}
