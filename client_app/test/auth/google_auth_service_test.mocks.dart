// Mocks generated by Mockito 5.4.4 from annotations
// in client_app/test/auth/google_auth_service_test.dart.
// Do not manually edit this file.

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'dart:async' as _i3;

import 'package:client_app/auth/google_auth_service.dart' as _i2;
import 'package:mockito/mockito.dart' as _i1;

// ignore_for_file: type=lint
// ignore_for_file: avoid_redundant_argument_values
// ignore_for_file: avoid_setters_without_getters
// ignore_for_file: comment_references
// ignore_for_file: deprecated_member_use
// ignore_for_file: deprecated_member_use_from_same_package
// ignore_for_file: implementation_imports
// ignore_for_file: invalid_use_of_visible_for_testing_member
// ignore_for_file: prefer_const_constructors
// ignore_for_file: unnecessary_parenthesis
// ignore_for_file: camel_case_types
// ignore_for_file: subtype_of_sealed_class

/// A class which mocks [GoogleAuthService].
///
/// See the documentation for Mockito's code generation for more information.
class MockGoogleAuthService extends _i1.Mock implements _i2.GoogleAuthService {
  MockGoogleAuthService() {
    _i1.throwOnMissingStub(this);
  }

  @override
  _i3.Future<void> signIn() => (super.noSuchMethod(
        Invocation.method(
          #signIn,
          [],
        ),
        returnValue: _i3.Future<void>.value(),
        returnValueForMissingStub: _i3.Future<void>.value(),
      ) as _i3.Future<void>);
}
