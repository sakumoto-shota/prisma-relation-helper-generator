import {
  UserHelper as BaseUserHelper,
  UserQueryBuilder as BaseUserQueryBuilder,
} from '../../prisma/generated-helpers/UserHelper';
import { Prisma } from '@prisma/client';

// UserQueryBuilderを拡張
export class UserQueryBuilder<
  Include extends object = object,
> extends BaseUserQueryBuilder<Include> {
  active(): UserQueryBuilder<Include> {
    return this.where({ isActive: true }) as UserQueryBuilder<Include>;
  }
  enableSoftDelete(): this {
    super.enableSoftDelete();
    return this;
  }
}

// UserHelperを拡張
type UserHelperType = typeof BaseUserHelper & {
  enableSoftDelete: boolean;
  active: () => UserQueryBuilder<object>;
};

export const UserHelper: UserHelperType = Object.assign({}, BaseUserHelper, {
  enableSoftDelete: true,
  where(conditions: Prisma.UserWhereInput): UserQueryBuilder<object> {
    const qb = new UserQueryBuilder().where(conditions);
    if (UserHelper.enableSoftDelete) qb.enableSoftDelete();
    return qb as UserQueryBuilder<object>;
  },
  with(relations: (keyof Prisma.UserInclude)[]): UserQueryBuilder<object> {
    const qb = new UserQueryBuilder().with(relations);
    if (UserHelper.enableSoftDelete) qb.enableSoftDelete();
    return qb as unknown as UserQueryBuilder<object>;
  },
  active(): UserQueryBuilder<object> {
    const qb = new UserQueryBuilder().active();
    if (UserHelper.enableSoftDelete) qb.enableSoftDelete();
    return qb;
  },
});
