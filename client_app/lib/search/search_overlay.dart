import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/search/search_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'dart:ui';

class SearchOverlay extends StatefulWidget {
  const SearchOverlay({Key? key}) : super(key: key);

  @override
  State<SearchOverlay> createState() => _SearchOverlayState();
}

class _SearchOverlayState extends State<SearchOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    _animationController.forward();

    // Automatically focus on the text field and show keyboard
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<NewstreamSearchController>();

    return Material(
      type: MaterialType.transparency,
      child: GestureDetector(
        onTap: () => Get.back(),
        child: FadeTransition(
          opacity: _animation,
          child: Stack(
            children: [
              // Blur effect
              Positioned.fill(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                  child: Container(color: Colors.black.withOpacity(0.85)),
                ),
              ),
              SafeArea(
                child: GestureDetector(
                  onTap:
                      () {}, // Prevents taps inside from dismissing the overlay
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 20, 16, 18),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.grey[900]?.withOpacity(0.92),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: TextField(
                            controller: TextEditingController(
                                text: controller.searchQuery.value),
                            focusNode: _focusNode,
                            onChanged: controller.onSearchQueryChanged,
                            style:
                                TextStyles.body.copyWith(color: Colors.white),
                            cursorColor: Colors.white,
                            autofocus: true,
                            decoration: InputDecoration(
                              hintText: 'Search...',
                              hintStyle: TextStyles.body
                                  .copyWith(color: Colors.white54),
                              prefixIcon:
                                  const Icon(Icons.search, color: Colors.white),
                              suffixIcon: IconButton(
                                icon: const Icon(Icons.close,
                                    color: Colors.white),
                                onPressed: () {
                                  controller.clearSearch();
                                  Get.back();
                                },
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(
                                  vertical: 14, horizontal: 8),
                            ),
                          ),
                        ),
                      ),

                      // Horizontal scrollable row of topic tiles
                      Obx(() {
                        if (controller.searchQuery.value.length < 2) {
                          return const SizedBox.shrink();
                        }
                        return SizedBox(
                          height: 140,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            itemCount: controller.searchResults.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: 24),
                            itemBuilder: (context, index) {
                              final topic = controller.searchResults[index];
                              return _SearchTopicTile(title: topic);
                            },
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SearchTopicTile extends StatelessWidget {
  final String title;
  const _SearchTopicTile({required this.title});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            color: const Color(0xFF232323),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.18),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: 100,
          child: Text(
            title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: TextStyles.bodyXs
                .copyWith(color: Colors.white, fontWeight: FontWeight.w400),
          ),
        ),
      ],
    );
  }
}
