import 'package:client_app/splashscreen/splashscreen_controller.dart';
import 'package:get/get.dart';

class SplashscreenBindings implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => SplashscreenController());
  }
}
