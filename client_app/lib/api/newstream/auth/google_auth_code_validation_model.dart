class GoogleAuthCodeValidation {
  final String accessToken;

  const GoogleAuthCodeValidation({
    required this.accessToken,
  });

  factory GoogleAuthCodeValidation.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'access_token': final String access_token,
      } =>
        GoogleAuthCodeValidation(
          accessToken: access_token,
        ),
      _ =>
        throw const FormatException('Failed to load GoogleAuthCodeValidation.'),
    };
  }
}
