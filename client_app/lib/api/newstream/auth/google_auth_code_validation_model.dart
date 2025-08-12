class GoogleAuthCodeValidation {
  const GoogleAuthCodeValidation({
    required this.accessToken,
    required this.id,
  });
  final String accessToken;
  final String id;

  factory GoogleAuthCodeValidation.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'access_token': final String access_token,
        'id': final String id,
      } =>
        GoogleAuthCodeValidation(
          accessToken: access_token,
          id: id,
        ),
      _ =>
        throw const FormatException('Failed to load GoogleAuthCodeValidation.'),
    };
  }
}
