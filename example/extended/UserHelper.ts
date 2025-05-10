import {
  UserHelper as BaseUserHelper,
  UserQueryBuilder as BaseUserQueryBuilder,
} from '../../prisma/generated-helpers/UserHelper';

// UserQueryBuilderを拡張
export class UserQueryBuilder<
  Include extends object = object,
> extends BaseUserQueryBuilder<Include> {
  active(): UserQueryBuilder<Include> {
    return this.where({ isActive: true }) as UserQueryBuilder<Include>;
  }
}

// UserHelperを拡張
export const UserHelper = {
  ...BaseUserHelper,
  where(conditions: any): UserQueryBuilder<object> {
    return new UserQueryBuilder().where(conditions) as UserQueryBuilder<object>;
  },
  with(relations: any): UserQueryBuilder<object> {
    return new UserQueryBuilder().with(relations) as UserQueryBuilder<object>;
  },
  active(): UserQueryBuilder<object> {
    return new UserQueryBuilder().active();
  },
};
