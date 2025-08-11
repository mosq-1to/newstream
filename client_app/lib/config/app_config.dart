import 'package:client_app/common/logger.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvModel {
  final String newstreamApiUrl;
  final String googleAuthServerClientId;
  final String sentryDsnUrl;

  EnvModel({
    required this.newstreamApiUrl,
    required this.googleAuthServerClientId,
    required this.sentryDsnUrl,
  });

  void validate() {
    if (newstreamApiUrl.isEmpty) {
      throw Exception('NEWSTREAM_API_URL is not set in .env file');
    }
    if (googleAuthServerClientId.isEmpty) {
      throw Exception('GOOGLE_AUTH_SERVER_CLIENT_ID is not set in .env file');
    }
    if (sentryDsnUrl.isEmpty) {
      throw Exception('SENTRY_DSN_URL is not set in .env file');
    }
  }

  factory EnvModel.fromMap(Map<String, String> map) {
    return EnvModel(
      newstreamApiUrl: map['NEWSTREAM_API_URL']!,
      googleAuthServerClientId: map['GOOGLE_AUTH_SERVER_CLIENT_ID']!,
      sentryDsnUrl: map['SENTRY_DSN_URL']!,
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
    try {
      await dotenv.load();
      env = EnvModel.fromMap(dotenv.env);
      env.validate();
    } catch (e) {
      logger.e('AppConfig', error: e);
    }
  }
}
