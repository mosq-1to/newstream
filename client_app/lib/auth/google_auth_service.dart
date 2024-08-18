import 'dart:convert';

import 'package:client_app/auth/current_user_model.dart';
import 'package:client_app/auth/google_auth_code_validation_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class GoogleAuthService {
  static final String _serverClientId =
      dotenv.env['GOOGLE_AUTH_SERVER_CLIENT_ID']!;
  static const List<String> _scopes = ['email'];

  static final GoogleSignIn _googleSignIn =
      GoogleSignIn(scopes: _scopes, serverClientId: _serverClientId);

  const GoogleAuthService();

  Future<String?> validateAuthCode(String code) async {
    try {
      final response = await http.get(
        Uri.http(dotenv.env['NEWSTREAM_API_URL']!, 'auth/google/callback', {
          'code': code,
          'scope': _scopes.join(' '),
        }),
      );

      if (response.statusCode == 200) {
        final data = GoogleAuthCodeValidation.fromJson(
            jsonDecode(response.body) as Map<String, dynamic>);
        return data.accessToken;
      }
    } catch (e) {
      print('[Error] GoogleAuthService.validateAuthCode: $e');
    }

    return null;
  }

  Future<CurrentUserModel?> signIn() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account != null) {
        final token = await validateAuthCode(account.serverAuthCode!);

        if (token == null) {
          return null;
        }
        return CurrentUserModel(email: account.email);
      }
    } catch (e) {
      print('[Error] GoogleAuthService.openPrompt: $e');
    }

    return null;
  }

  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
    } catch (e) {
      print('[Error] GoogleAuthService.signOut: $e');
    }
  }
}
