// user_service_test.dart
import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:client_app/user/user_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mockito/mockito.dart';

import 'newstream_api_test.mocks.mocks.dart'; // Import the generated mock file

void main() {
  group('UserService', () {
    late MockNewstreamApi mockNewstreamApi;
    late UserService userService;

    setUp(() {
      // Initialize the mock and UserService
      mockNewstreamApi = MockNewstreamApi();
      Get.put<NewstreamApi>(mockNewstreamApi); // Register the mock using GetX
      userService = UserService();
    });

    tearDown(() {
      Get.reset(); // Clean up the GetX dependencies
    });

    test('getCurrentUser should return user when API call is successful',
        () async {
      // Arrange
      const expectedUser = CurrentUser(
          id: 'john-id-1', email: 'john@doe.com'); // Adjust fields as needed
      when(mockNewstreamApi.getCurrentUser())
          .thenAnswer((_) async => expectedUser);

      // Act
      final user = await userService.getCurrentUser();

      // Assert
      expect(user, expectedUser);
      verify(mockNewstreamApi.getCurrentUser()).called(1);
    });

    test('getCurrentUser should return null when API call fails', () async {
      // Arrange
      when(mockNewstreamApi.getCurrentUser()).thenAnswer((_) async => null);

      // Act
      final user = await userService.getCurrentUser();

      // Assert
      expect(user, isNull);
      verify(mockNewstreamApi.getCurrentUser()).called(1);
    });
  });
}
