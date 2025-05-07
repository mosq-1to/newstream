import 'package:client_app/player/player_controller.dart';
import 'package:get/get.dart';

class PlayerBindings implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => PlayerController());
  }
}
