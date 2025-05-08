import { UserHelper } from '../prisma/generated-helpers/UserHelper';

(async () => {
  const user = await UserHelper.findById(1);
  console.log(user?.profile?.image);
})();