import 'dart:async';
import 'package:client_app/api/newstream/models/article_model.dart';
import 'package:client_app/api/newstream/models/brief_model.dart';
import 'package:client_app/common/analytics/analytics_event.dart';
import 'package:client_app/common/reporting_service.dart';
import 'package:client_app/common/theme/text_styles.dart';
import 'package:client_app/common/ui/tappable.dart';
import 'package:client_app/player/player_controller.dart';
import 'package:client_app/player/widgets/player_controls.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:url_launcher/url_launcher.dart';

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
                                        SizedBox(
                                          height: 364,
                                          child: SingleChildScrollView(
                                            child: Text(
                                              currentBrief.content,
                                              style: const TextStyle(
                                                fontSize: 24,
                                                fontWeight: FontWeight.w300,
                                                color: Color.fromARGB(
                                                  255,
                                                  172,
                                                  172,
                                                  172,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 48),
                                        PlayerControls(),
                                        const SizedBox(height: 48),
                                        _buildSourcesSection(
                                            currentBrief.articles),
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
          onPressed: () {
            unawaited(ReportingService.reportEvent(
              UserTapEvent(screen: 'Player', label: 'Close Player'),
            ));
            Navigator.of(context).pop();
          },
        ),
        // Text(
        //   brief.content,
        //   style: TextStyles.headingMd,
        //   maxLines: 2,
        //   overflow: TextOverflow.ellipsis,
        // ),
      ],
    );
  }

  Widget _buildSourcesSection(List<Article> articles) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Sources',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: articles.length,
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final article = articles[index];
            return Tappable(
              onTap: () async {
                unawaited(ReportingService.reportEvent(
                  UserTapEvent(screen: 'Player', label: 'Open source article'),
                ));
                final url = Uri.parse(article.url);
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                }
              },
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Article thumbnail
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: article.thumbnailUrl?.isNotEmpty == true
                        ? Image.network(
                            article.thumbnailUrl!,
                            width: 80,
                            height: 60,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                width: 80,
                                height: 60,
                                color: Colors.grey[800],
                                child: const Center(
                                  child: Icon(
                                    Icons.image_not_supported,
                                    color: Colors.white54,
                                  ),
                                ),
                              );
                            },
                          )
                        : Container(
                            width: 80,
                            height: 60,
                            color: Colors.grey[800],
                            child: const Center(
                              child: Icon(
                                Icons.article,
                                color: Colors.white54,
                              ),
                            ),
                          ),
                  ),
                  const SizedBox(width: 12),
                  // Article title
                  Expanded(
                    child: Text(
                      article.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.white,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}
