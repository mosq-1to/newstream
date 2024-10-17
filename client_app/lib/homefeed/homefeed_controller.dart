import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();
  final RxList<Story> stories = RxList<Story>([]);

  @override
  Future<void> onInit() async {
    super.onInit();
    fetchStories();
  }

  Future<void> fetchStories() async {
    stories.value = await _newstreamApi.getStories();
  }

  void openStory(Story story) {
    // TODO Open story
    print('Story opened: ${story.id}');
  }
}
