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

  Future<void> signIn() async {
    final GoogleSignInAccount? account = await _googleSignIn.signIn();

    if (account == null) {
      throw Exception('Failed to sign in with Google');
    }

    await _newstreamApi.validateGoogleAuthCode(account.serverAuthCode!);
  }
}
