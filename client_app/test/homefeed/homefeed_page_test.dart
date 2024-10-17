import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/api/newstream/stories/story_model.dart';
import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:client_app/homefeed/homefeed_page.dart';
import 'package:client_app/homefeed/widgets/stories_list_entry.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mockito/mockito.dart';

import '../api/newstream_api_test.mocks.dart';

void main() {
  late MockNewstreamApi mockNewstreamApi;
  late HomefeedController homefeedController;

  setUp(() {
    mockNewstreamApi = MockNewstreamApi();
    Get.put<NewstreamApi>(mockNewstreamApi);

    homefeedController = HomefeedController();
    Get.lazyPut<HomefeedController>(() => homefeedController);
  });

  tearDown(() {
    Get.delete<NewstreamApi>();
    Get.delete<HomefeedController>();
  });

  testWidgets('renders stories', (WidgetTester tester) async {
    // Given
    when(mockNewstreamApi.getStories()).thenAnswer(
      (_) async => Future.value([
        const Story(
          id: '1',
          title: 'Story 1',
          content: 'Content 1',
          url: '',
          thumbnailUrl: '',
        ),
        const Story(
          id: '2',
          title: 'Story 2',
          content: 'Content 2',
          url: '',
          thumbnailUrl: '',
        ),
      ]),
    );

    // When
    await tester.pumpWidget(GetMaterialApp(home: HomefeedPage()));
    await tester.pump();

    // Then
    expect(find.text('Recent stories'), findsOneWidget);
    expect(tester.widgetList(find.byType(StoriesListEntry)).length, 2);
  });
}
