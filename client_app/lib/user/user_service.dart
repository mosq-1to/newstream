import 'package:client_app/api/newstream/auth/current_user_model.dart';
import 'package:client_app/api/newstream/newstream_api.dart';
import 'package:get/get.dart';

class UserService {
  final NewstreamApi _newstreamApi = Get.find();

  // TODO: Store the user data in the service
  Future<CurrentUser?> getCurrentUser() async {
    final user = _newstreamApi.getCurrentUser();
    return user;
  }
}
