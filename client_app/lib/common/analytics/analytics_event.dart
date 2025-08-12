class AnalyticsEvent {
  const AnalyticsEvent(this.name, {this.properties = const {}});

  final String name;
  final Map<String, dynamic> properties;
}

enum SignInProvider { google, session }

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

class ScreenViewEvent extends AnalyticsEvent {
  ScreenViewEvent({
    required String to,
    required String from,
    bool? isBack,
  }) : super(
          'Screen view',
          properties: {'to': to, 'from': from, 'isBack': isBack},
        );
}

class UserTapEvent extends AnalyticsEvent {
  UserTapEvent({
    required String screen,
    required String label,
  }) : super(
          'User tap',
          properties: {'screen': screen, 'label': label},
        );
}
