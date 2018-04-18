import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { User, UserQueryParams } from './user.service.models';

export async function createUser(userData: Partial<User>): Promise<User> {
  return await addToCollection('user', userData);
}

export async function updateUser(userId: string, userUpdates: Partial<User>, currentUser?: User): Promise<User> {
  // TODO: check here to make sure currentUser has permission to make this change

  return await updateDocInCollection('user', userId, userUpdates);
}

export async function getUser(params: UserQueryParams): Promise<User> {
  const users = (await queryCollection('user', params)) || [];
  return users[0];
}

export async function getUsers(params: UserQueryParams): Promise<User[]> {
  return queryCollection('user', params);
}

export async function deleteUser(id: string) {
  return deleteDocFromCollection('user', id);
}

export async function deleteUsers(params: UserQueryParams) {
  return deleteDocsFromCollection('user', params);
}
