import 'dart:convert';

import 'package:client_app/auth/current_user_model.dart';
import 'package:client_app/auth/google_auth_code_validation_model.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class GoogleAuthService {
  // TODO: Move to environment variables
  static const String _serverClientId =
      '60310253427-v3hci9niu30lh91vjcljqnag744v80fq.apps.googleusercontent.com';

  static final GoogleSignIn _googleSignIn =
      GoogleSignIn(scopes: ['email'], serverClientId: _serverClientId);

  const GoogleAuthService();

  Future<String?> validateAuthCode(String code) async {
    try {
      final response = await http.get(
        Uri.http('10.0.2.2:3000', 'auth/google/callback', {
          'code': code,
          'authuser': '0',
          'prompt': 'consent',
          'scope': 'email',
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
