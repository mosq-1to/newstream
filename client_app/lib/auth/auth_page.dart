import 'package:flutter/cupertino.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      child: Center(
        child: CupertinoButton(
          child: const Text('Sign in'),
          onPressed: () {
            print('clicked');
          },
        ),
      ),
    );
  }
}