import 'package:flutter/widgets.dart';

import '../theme/text_styles.dart';

class Button extends StatefulWidget {
  final Widget? startChild;
  final String text;
  final VoidCallback onPressed;

  const Button(
      {super.key,
      required this.text,
      required this.onPressed,
      this.startChild});

  @override
  ButtonState createState() => ButtonState();
}

class ButtonState extends State<Button> {
  bool _isPressed = false;

  void _onTapDown(TapDownDetails details) {
    setState(() {
      _isPressed = true;
    });
  }

  void _onTapUp(TapUpDetails details) {
    setState(() {
      _isPressed = false;
    });
    widget.onPressed();
  }

  void _onTapCancel() {
    setState(() {
      _isPressed = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedContainer(
        decoration: BoxDecoration(
          color: const Color(0xFF606060).withOpacity(_isPressed ? 0.15 : 0.25),
          borderRadius: BorderRadius.circular(30),
        ),
        duration: const Duration(milliseconds: 50),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 18),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  widget.startChild ?? Container(),
                  widget.startChild != null
                      ? const SizedBox(width: 16)
                      : Container(),
                  Text(widget.text,
                      style: TextStyles.body
                          .copyWith(fontWeight: FontWeight.w500)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
