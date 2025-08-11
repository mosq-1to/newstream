import 'dart:async';

import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/reporting_service.dart';
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
    } catch (e, st) {
      _handleError(e, st);
    }
  }

  void clearSearch() {
    try {
      searchQuery.value = '';
      searchResults.clear();
    } catch (e, st) {
      _handleError(e, st);
    }
  }

  void _handleError(Object e, [StackTrace? st]) {
    unawaited(
      ReportingService.reportError(
        e,
        st ?? StackTrace.current,
        showToast: true,
      ),
    );
  }
}
