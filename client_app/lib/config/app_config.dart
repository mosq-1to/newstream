import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  final String newstreamApiUrl;
  final String googleAuthServerClientId;

  Env({
    required this.newstreamApiUrl,
    required this.googleAuthServerClientId,
  });

  factory Env.fromMap(Map<String, String> map) {
    return Env(
      newstreamApiUrl: map['NEWSTREAM_API_URL']!,
      googleAuthServerClientId: map['GOOGLE_AUTH_SERVER_CLIENT_ID']!,
    );
  }
}

/// Singleton class to hold the app configuration
class AppConfig {
  late Env env;

  factory AppConfig() {
    return _instance;
  }

  AppConfig._privateConstructor() {
    final env = dotenv.env;

    // Utilize object validator when the size of the environment variables grows
    if (env['NEWSTREAM_API_URL'] == null) {
      throw Exception('NEWSTREAM_API_URL is not set in .env file');
    }
    if (env['GOOGLE_AUTH_SERVER_CLIENT_ID'] == null) {
      throw Exception('GOOGLE_AUTH_SERVER_CLIENT_ID is not set in .env file');
    }

    this.env = Env.fromMap(env);
  }

  static final AppConfig _instance = AppConfig._privateConstructor();

  static Future<void> initialize() async {
    await dotenv.load();
  }
}
