import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:get/get.dart';

class HomefeedController extends GetxController {
  final NewstreamApi _newstreamApi = Get.find();
  final RxList<Story> stories = RxList<Story>([]);
  final RxInt currentPage = RxInt(0);

  @override
  Future<void> onInit() async {
    super.onInit();
    fetchStories();
  }

  Future<void> fetchStories() async {
    stories.value = (await _newstreamApi.getStories()).take(5).toList();
  }

  Future<void> fetchMoreStories() async {
    //TODO Add real pagination
    final newStories = (await _newstreamApi.getStories())
        .skip(currentPage.value * 5)
        .take(5)
        .toList();

    if (newStories.isNotEmpty) {
      currentPage.value++;
      stories.value = [...stories, ...newStories];
    }
  }

  void openStory(Story story) {
    // TODO Open story
    print('Story opened: ${story.id}');
  }
}
