import { UserHelper } from '../generated-helpers/UserHelper';

(async () => {
  const user = await UserHelper.findById(1);
  console.log(user?.profile?.image);
})();