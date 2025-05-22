import 'package:client_app/search/search_controller.dart';
import 'package:get/get.dart';

class SearchBindings extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<NewstreamSearchController>(() => NewstreamSearchController());
  }
}
