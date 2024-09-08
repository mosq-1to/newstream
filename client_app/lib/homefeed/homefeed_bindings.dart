import 'package:client_app/homefeed/homefeed_controller.dart';
import 'package:get/get.dart';

class AuthBindings implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => HomefeedController());
  }
}
