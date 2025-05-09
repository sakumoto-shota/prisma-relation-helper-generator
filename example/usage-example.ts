import { UserHelper } from '../prisma/generated-helpers/UserHelper';

(async (): Promise<void> => {
  const user = await UserHelper.findById(1);
  console.log(user);
})();
