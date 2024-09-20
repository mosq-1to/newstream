import 'package:client_app/api/newstream/newsteram_api.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  static final String _serverClientId =
      dotenv.env['GOOGLE_AUTH_SERVER_CLIENT_ID']!;
  static const List<String> _scopes = ['email', 'profile'];

  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: _scopes,
    serverClientId: _serverClientId,
  );
  final NewstreamApi _newstreamApi;

  const GoogleAuthService({required NewstreamApi newstreamApi})
      : _newstreamApi = newstreamApi;

  /// Returns the access token if the user successfully signs in.
  Future<String?> signIn() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account == null) {
        return null;
      }

      final response =
          await _newstreamApi.validateGoogleAuthCode(account.serverAuthCode!);

      if (response == null) {
        return null;
      }

      return response.accessToken;
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
