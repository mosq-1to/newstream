import 'package:client_app/common/theme/dark_background_layout.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_controls.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PlayerPage extends StatelessWidget {
  final PlayerController controller = Get.find<PlayerController>();

  PlayerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: DarkBackgroundLayout(
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
                _buildHeader(),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 16),
                        _buildThumbnail(
                          currentStory.thumbnailUrl,
                          playerState.isProcessing,
                        ),
                        const SizedBox(height: 24),
                        Text(
                          currentStory.title,
                          style: TextStyles.headingMd.copyWith(height: 1.2),
                          maxLines: 4,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 48),
                        const Spacer(),
                        PlayerControls(),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () => Get.back(),
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
