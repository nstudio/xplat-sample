import { User, UserQueryParams, UserSession } from './user.service.models';
import { getUser, getUsers, updateUser } from './user.service';

interface UserQueryArgs {
  params: UserQueryParams;
}

interface UpdateUserArgs {
  userId: string;
  userUpdates: Partial<User>;
}

export const userResolver = {
  Query: {
    me: (root: any, args: any, { currentUser }: UserSession) => currentUser,
    getUser: (root: any, { params }: UserQueryArgs, { currentUser }: UserSession) => getUser(params),
    getUsers: (root: any, { params }: UserQueryArgs, { currentUser }: UserSession) => getUsers(params)
  },
  Mutation: {
    updateUser: (root: any, args: UpdateUserArgs, { currentUser }: UserSession) => updateUser(args.userId, args.userUpdates, currentUser)
  }
};
