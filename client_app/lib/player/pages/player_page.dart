import 'dart:ui';

import 'package:client_app/api/newstream/models/brief_model.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_controls.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:material_symbols_icons/symbols.dart';

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
  void initState() {
    super.initState();
    _dragController.addListener(() {
      // dirty hack to close the sheet natively
      if (_dragController.size < 0.11) {
        _dragController.jumpTo(0.09);
      }
    });
  }

  @override
  void dispose() {
    _dragController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 1.0,
      minChildSize: 0.1,
      controller: _dragController,
      snap: true,
      snapSizes: const [1.0],
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Color.fromRGBO(0, 0, 0, 1),
          ),
          child: SafeArea(
            child: Obx(() {
              final playerState = controller.playerState.value;
              final currentBrief = playerState.currentBrief;

              if (currentBrief == null) {
                return const Center(
                  child: Text(
                    'No brief is currently playing',
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
                            physics: const ScrollPhysics(),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 12,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 36),
                                  _buildHeader(currentBrief),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 12,
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const SizedBox(height: 24),
                                        Text(
                                          currentBrief.content,
                                          style: TextStyles.headingMd
                                              .copyWith(height: 1.2),
                                          maxLines: 4,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 48),
                                        PlayerControls(),
                                      ],
                                    ),
                                  ),
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
        );
      },
    );
  }

  Widget _buildHeader(Brief brief) {
    return Row(
      children: [
        IconButton(
          icon: const Icon(
            Symbols.keyboard_arrow_down,
            color: Colors.white,
            size: 40,
            weight: 200,
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        Text(
          brief.content,
          style: TextStyles.headingMd,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}
