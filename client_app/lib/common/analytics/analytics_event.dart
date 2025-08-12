class AnalyticsEvent {
  const AnalyticsEvent(this.name, {this.properties = const {}});

  final String name;
  final Map<String, String> properties;
}

enum SignInProvider { google, recognized }

class SignInEvent extends AnalyticsEvent {
  SignInEvent({
    required SignInProvider provider,
  }) : super(
          'Sign in',
          properties: {'provider': provider.name},
        );
}

class ErrorEvent extends AnalyticsEvent {
  ErrorEvent(
    Object error,
    StackTrace stackTrace,
  ) : super(
          'Error',
          properties: {
            'error': error.toString(),
            'stackTrace': stackTrace.toString(),
          },
        );
}
