import 'package:client_app/api/newstream/newsteram_api.dart';
import 'package:client_app/config/app_config.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  final NewstreamApi _newstreamApi = Get.find();

  static const List<String> _scopes = ['email', 'profile'];

  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: _scopes,
    serverClientId: AppConfig().env.googleAuthServerClientId,
  );

  /// Returns the access token if the user successfully signs in.
  Future<String?> signIn() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account == null) {
        throw Exception('Failed to sign in with Google');
      }

      final response =
          await _newstreamApi.validateGoogleAuthCode(account.serverAuthCode!);

      if (response == null) {
        throw Exception('Failed to validate sign in with Google');
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
