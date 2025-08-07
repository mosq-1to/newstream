import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:get/get.dart';

class NewstreamSearchController extends GetxController {
  final searchQuery = ''.obs;
  final RxList<Topic> searchResults = <Topic>[].obs;
  final NewstreamApi _newstreamApi = Get.find();

  Future<void> onSearchQueryChanged(String query) async {
    try {
      searchQuery.value = query;

      if (query.length >= 2) {
        searchResults.value = await _newstreamApi.fetchTopics().then((topics) {
          return topics
              .where(
                (topic) =>
                    topic.title.toLowerCase().contains(query.toLowerCase()),
              )
              .toList();
        });
      } else {
        searchResults.clear();
      }
    } catch (e) {
      _handleError(e);
    }
  }

  void clearSearch() {
    try {
      searchQuery.value = '';
      searchResults.clear();
    } catch (e) {
      _handleError(e);
    }
  }

  void _handleError(e) {
    ToastService.showError('Something went wrong. Try again later');
    logger.e(
      '[Error] NewstreamSearchController.clearSearch',
      error: e,
    );
  }
}
