import 'package:client_app/common/theme/dark_background_container.dart';
import 'package:flutter/material.dart';

class HomefeedPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: DarkBackgroundContainer(
        child: Center(
          child: Text('Homefeed'),
        ),
      ),
    );
  }
}
