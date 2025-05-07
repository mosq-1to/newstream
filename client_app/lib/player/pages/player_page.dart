import 'dart:ui';

import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_controls.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PlayerPage extends StatefulWidget {
  const PlayerPage({super.key});

  @override
  State<PlayerPage> createState() => _PlayerPageState();

  static Future<void> show(BuildContext context) async {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const PlayerPage(),
    );
  }
}

class _PlayerPageState extends State<PlayerPage> {
  final PlayerController controller = Get.find<PlayerController>();
  final DraggableScrollableController _dragController =
      DraggableScrollableController();

  @override
  void dispose() {
    _dragController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 1.0,
      controller: _dragController,
      snap: true,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Color.fromRGBO(23, 23, 23, 0.9),
          ),
          child: ClipRRect(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
              child: SafeArea(
                child: Obx(() {
                  final playerState = controller.playerState.value;
                  final currentStory = playerState.currentStory;

                  if (currentStory == null) {
                    return const Center(
                      child: Text(
                        'No story is currently playing',
                        style: TextStyles.headingMd,
                      ),
                    );
                  }

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          children: [
                            // Scrollable content area
                            Expanded(
                              child: SingleChildScrollView(
                                controller: scrollController,
                                physics: const ClampingScrollPhysics(),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 24),
                                  child: Column(
                                    children: [
                                      _buildHeader(),
                                      const SizedBox(height: 16),
                                      _buildThumbnail(
                                        currentStory.thumbnailUrl,
                                        playerState.isProcessing,
                                      ),
                                      const SizedBox(height: 24),
                                      Text(
                                        currentStory.title,
                                        style: TextStyles.headingMd
                                            .copyWith(height: 1.2),
                                        maxLines: 4,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 48),
                                      PlayerControls()
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        const SizedBox(height: 36),
        Row(
          children: [
            IconButton(
              icon: const Icon(
                Icons.keyboard_arrow_down,
                color: Colors.white,
                size: 36,
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildThumbnail(String thumbnailUrl, bool isProcessing) {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            Image.network(
              thumbnailUrl,
              width: 220,
              height: 220,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 220,
                  height: 220,
                  color: const Color(0xFF333333),
                  child: const Icon(
                    Icons.image_not_supported,
                    color: Colors.white,
                    size: 64,
                  ),
                );
              },
            ),
            if (isProcessing)
              Container(
                width: 220,
                height: 220,
                color: Colors.black.withAlpha(120),
                child: const Center(
                  child: SizedBox(
                    width: 48,
                    height: 48,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
