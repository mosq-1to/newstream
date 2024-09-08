import 'dart:convert';

import 'package:client_app/api/newstream/auth/google_auth_code_validation_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class NewstreamApi {
  Future<GoogleAuthCodeValidation?> validateGoogleAuthCode(String code) async {
    try {
      final response = await http.get(
        Uri.http(
          dotenv.env['NEWSTREAM_API_URL']!,
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
}
