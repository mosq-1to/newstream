import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvModel {
  final String newstreamApiUrl;
  final String googleAuthServerClientId;

  EnvModel({
    required this.newstreamApiUrl,
    required this.googleAuthServerClientId,
  });

  void validate() {
    if (newstreamApiUrl.isEmpty) {
      throw Exception('NEWSTREAM_API_URL is not set in .env file');
    }
    if (googleAuthServerClientId.isEmpty) {
      throw Exception('GOOGLE_AUTH_SERVER_CLIENT_ID is not set in .env file');
    }
  }

  factory EnvModel.fromMap(Map<String, String> map) {
    return EnvModel(
      newstreamApiUrl: map['NEWSTREAM_API_URL']!,
      googleAuthServerClientId: map['GOOGLE_AUTH_SERVER_CLIENT_ID']!,
    );
  }
}

/// Singleton class to hold the app configuration
class AppConfig {
  late EnvModel env;

  factory AppConfig() {
    return _instance;
  }

  AppConfig._privateConstructor();

  static final AppConfig _instance = AppConfig._privateConstructor();

  Future<void> initialize() async {
    await dotenv.load();
    env = EnvModel.fromMap(dotenv.env);
    env.validate();
  }
}
