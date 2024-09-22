import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/auth/google_auth_service.dart';
import 'package:client_app/main.dart';
import 'package:client_app/user/user_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:integration_test/integration_test.dart';
import 'package:mockito/mockito.dart';

import '../test/auth/google_auth_service_test.mocks.dart';
import '../test/user/user_service_test.mocks.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  binding.framePolicy = LiveTestWidgetsFlutterBindingFramePolicy.fullyLive;

  group('Login flow', () {
    late MockUserService mockUserService;
    late MockGoogleAuthService mockGoogleAuthService;

    setUp(() {
      mockUserService = MockUserService();
      mockGoogleAuthService = MockGoogleAuthService();
      Get.put<GoogleAuthService>(mockGoogleAuthService);
      Get.put<UserService>(mockUserService);
    });

    tearDown(
      () => {
        Get.reset(),
      },
    );

    testWidgets('Log in via Google', (WidgetTester tester) async {
      when(mockGoogleAuthService.signIn()).thenAnswer(
        (_) async => {},
      );
      when(mockUserService.getCurrentUser()).thenAnswer(
        (realInvocation) async => null,
      );

      await tester.pumpWidget(const MyApp());
      await tester.pumpAndSettle();

      expect(find.text('Welcome to Newstream'), findsOneWidget);

      await tester.tap(find.byKey(const Key('auth_page_google_button')));
      when(mockUserService.getCurrentUser()).thenAnswer(
        (realInvocation) async =>
            const CurrentUser(id: 'id', email: 'john@doe.com'),
      );
      await tester.pumpAndSettle();

      expect(find.text('john@doe.com'), findsOneWidget);
    });
  });
}
