import 'package:client_app/common/theme/text_styles.dart';
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/material_symbols_icons.dart';

class BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  const BottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        splashFactory: NoSplash.splashFactory,
      ),
      child: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white54,
        currentIndex: currentIndex,
        onTap: onTap,
        type: BottomNavigationBarType.fixed,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedLabelStyle: TextStyles.bodyXs,
        unselectedLabelStyle: TextStyles.bodyXs,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Symbols.home, size: 36, weight: 200),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Symbols.search, size: 36, weight: 200),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Symbols.person, size: 36, weight: 200),
            label: 'My space',
          ),
        ],
      ),
    );
  }
}
