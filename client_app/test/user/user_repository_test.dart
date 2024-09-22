import 'package:client_app/user/user_repository.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('UserRepository', () {
    test('setAccessToken should save token to SharedPreferences', () async {
      // Given
      const mockToken = 'test_token';
      final Map<String, Object> values = {};
      SharedPreferences.setMockInitialValues(values);

      // When
      await UserRepository.setAccessToken(mockToken);

      // Then
      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getString('UserRepository.accessToken'), mockToken);
    });

    test('getAccessToken should return the saved token from SharedPreferences',
        () async {
      // Given
      const mockToken = 'test_token';
      final Map<String, Object> values = {
        'UserRepository.accessToken': mockToken
      };
      SharedPreferences.setMockInitialValues(values);

      // When
      final token = await UserRepository.getAccessToken();

      // Then
      expect(token, mockToken);
    });

    test('getAccessToken should return null if no token is saved', () async {
      // Given
      SharedPreferences.setMockInitialValues({});

      // When
      final token = await UserRepository.getAccessToken();

      // Then
      expect(token, isNull);
    });
  });
}
