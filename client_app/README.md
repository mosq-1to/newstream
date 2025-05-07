# Newstream mobile app (Android / iOS)

## Getting Started

### Pre-requisites

You would probably need to add a new SHA1 to Google Sign In service configuration in Google Cloud Platform.
In order to do that, follow the instructions:
https://developers.google.com/android/guides/client-auth?hl=pl

`flutter pub get`

`flutter run`

## Testing

### Pre-requisites

Make sure that all of the mocks are built before running the tests by running:

`dart run build_runner build`

### Unit tests

`flutter test`

### Integration tests

`flutter test integration_test`