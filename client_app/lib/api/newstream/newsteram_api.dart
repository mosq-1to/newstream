import 'dart:convert';

import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/auth/google_auth_code_validation_model.dart';
import 'package:client_app/config/app_config.dart';
import 'package:http/http.dart' as http;

class NewstreamApi {
  Future<GoogleAuthCodeValidation?> validateGoogleAuthCode(String code) async {
    try {
      final response = await http.get(
        Uri.http(
          AppConfig().env.newstreamApiUrl,
          'auth/google/callback',
          {'code': code},
        ),
      );

      if (response.statusCode != 200) {
        throw Exception(
            'Failed to validate Google Auth code: ${response.body}');
      }

      final responseBody = jsonDecode(response.body) as Map<String, dynamic>;
      return GoogleAuthCodeValidation.fromJson(responseBody);
    } catch (e) {
      print('[Error] NewstreamApi.validateGoogleAuth: $e');
    }

    return null;
  }

  Future<CurrentUser?> getCurrentUser(String accessToken) async {
    try {
      final response = await http.get(
        Uri.http(
          AppConfig().env.newstreamApiUrl,
          'auth/users/me',
        ),
        headers: {
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to get current user: ${response.body}');
      }

      final responseBody = jsonDecode(response.body) as Map<String, dynamic>;
      return CurrentUser.fromJson(responseBody);
    } catch (e) {
      print('[Error] NewstreamApi.getCurrentUser: $e');
    }

    return null;
  }
}
