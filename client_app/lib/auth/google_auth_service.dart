import 'package:client_app/auth/current_user_model.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  // TODO: Move to environment variables
  static const String _serverClientId =
      '60310253427-v3hci9niu30lh91vjcljqnag744v80fq.apps.googleusercontent.com';

  static final GoogleSignIn _googleSignIn =
      GoogleSignIn(scopes: ['email'], serverClientId: _serverClientId);

  const GoogleAuthService();

  Future<CurrentUserModel?> openPrompt() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account != null) {
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
