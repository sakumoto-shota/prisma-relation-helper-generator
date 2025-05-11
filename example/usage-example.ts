import { UserHelper } from '../dist/generated-helpers/UserHelper';

(async (): Promise<void> => {
  const user = await UserHelper.findById(1);
  console.log(user);
})();
