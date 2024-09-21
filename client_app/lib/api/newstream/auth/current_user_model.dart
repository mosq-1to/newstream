class CurrentUser {
  final String id;
  final String email;

  const CurrentUser({
    required this.id,
    required this.email,
  });

  factory CurrentUser.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': final String id,
        'email': final String email,
      } =>
        CurrentUser(
          id: id,
          email: email,
        ),
      _ => throw const FormatException('Failed to load CurrentUser.'),
    };
  }
}
