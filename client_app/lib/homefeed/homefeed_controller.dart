import 'dart:async';

import 'package:client_app/api/newstream/models/topic_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/common/logger.dart';
import 'package:client_app/common/toast_service.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();
  final Rxn<Map<String, List<Topic>>> topics = Rxn<Map<String, List<Topic>>>();

  @override
  void onInit() {
    super.onInit();
    unawaited(fetchTopics());
  }

  Future<void> fetchTopics() async {
    try {
      final fetchedTopics = await _newstreamApi.fetchTopics();
      final Map<String, List<Topic>> grouped = {};
      for (final topic in fetchedTopics) {
        grouped.putIfAbsent(topic.categoryTitle, () => []).add(topic);
      }
      topics.value = grouped;
    } catch (e) {
      _handleError(e);
    }
  }

  void _handleError(e) {
    logger.e('HomefeedController', error: e);
    ToastService.showError('Something went wrong. Try again later');
  }
}
