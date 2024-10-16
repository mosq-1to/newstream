import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:integration_test/integration_test.dart';
import 'package:mockito/mockito.dart';

import '../test/api/newstream_api_test.mocks.dart';
import '../test/auth/google_auth_service_test.mocks.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  binding.framePolicy = LiveTestWidgetsFlutterBindingFramePolicy.fullyLive;

  group('App initialization', () {
    late MockNewstreamApi mockNewstreamApi;
    late MockGoogleAuthService mockGoogleAuthService;

    setUp(() {
      mockNewstreamApi = MockNewstreamApi();
      mockGoogleAuthService = MockGoogleAuthService();
      Get.put<GoogleAuthService>(mockGoogleAuthService);
      Get.put<NewstreamApi>(mockNewstreamApi);
    });

    tearDown(
      () => {
        Get.reset(),
      },
    );

    testWidgets('User signs in via Google', (tester) async {
      when(mockGoogleAuthService.signIn()).thenAnswer(
        (_) async => {},
      );
      when(mockNewstreamApi.getCurrentUser()).thenAnswer(
        (realInvocation) async => null,
      );

      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      expect(find.text('Welcome to Newstream'), findsOneWidget);

      await tester.tap(find.byKey(const Key('auth_page_google_button')));
      when(mockNewstreamApi.getCurrentUser()).thenAnswer(
        (realInvocation) async =>
            const CurrentUser(id: 'id', email: 'john@doe.com'),
      );
      when(mockNewstreamApi.getStories()).thenAnswer(
        (realInvocation) async => [],
      );
      await tester.pumpAndSettle();

      expect(find.text('Recent stories'), findsOneWidget);
    });

    testWidgets('User is recognized', (tester) async {
      when(mockNewstreamApi.getCurrentUser()).thenAnswer(
        (realInvocation) async =>
            const CurrentUser(id: 'id', email: 'john@doe.com'),
      );
      when(mockNewstreamApi.getStories()).thenAnswer(
        (realInvocation) async => [],
      );

      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      expect(find.text('Recent stories'), findsOneWidget);
    });
  });
}
