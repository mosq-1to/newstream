import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Singleton class to hold the app configuration
class AppConfig {
  factory AppConfig() {
    return _instance;
  }

  AppConfig._privateConstructor();

  static final AppConfig _instance = AppConfig._privateConstructor();

  String get newstreamApiUrl => dotenv.env['NEWSTREAM_API_URL']!;

  String get googleAuthServerClientId =>
      dotenv.env['GOOGLE_AUTH_SERVER_CLIENT_ID']!;
}
