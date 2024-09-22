import 'dart:convert';

import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/auth/google_auth_code_validation_model.dart';
import 'package:client_app/config/app_config.dart';
import 'package:client_app/user/user_repository.dart';
import 'package:http/http.dart' as http;

// TODO List
// * Move accessToken to a middleware
// * Maintain stable connection with API using http.Client

class NewstreamApi {
  String? _accessToken;

  Future<void> validateGoogleAuthCode(String code) async {
    final response = await http.get(
      Uri.http(
        AppConfig().env.newstreamApiUrl,
        'auth/google/callback',
        {'code': code},
      ),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to validate Google Auth code: ${response.body}');
    }

    final responseBody = jsonDecode(response.body) as Map<String, dynamic>;
    final validationResponse = GoogleAuthCodeValidation.fromJson(responseBody);
    _setAccessToken(validationResponse.accessToken);
  }

  Future<CurrentUser?> getCurrentUser() async {
    await _loadAccessToken();

    if (_accessToken == null) {
      throw Exception('accessToken is not set');
    }

    final response = await http.get(
      Uri.http(
        AppConfig().env.newstreamApiUrl,
        'auth/users/me',
      ),
      headers: {
        'Authorization': 'Bearer $_accessToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get current user: ${response.body}');
    }

    final responseBody = jsonDecode(response.body) as Map<String, dynamic>;
    return CurrentUser.fromJson(responseBody);
  }

  void _setAccessToken(String token) {
    _accessToken = token;
    UserRepository.setAccessToken(token);
  }

  Future<void> _loadAccessToken() async {
    _accessToken = await UserRepository.getAccessToken();
  }
}
