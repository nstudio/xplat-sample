import gql from 'graphql-tag';
import { api } from '../../helpers';
import { User, UserQueryParams } from './user.service.models';

export async function me(): Promise<User> {
  const gqlQuery = gql`
    query Me {
      me {
        isAdmin
        username
        displayName
        email
        emailLower
        twitterHandle
        profileImageUrl
        products
      }
    }
  `;
  const resp = await api().query({ query: gqlQuery });
  const data = resp.data as any;
  return data.me as User;
}

export async function getUser(params: UserQueryParams): Promise<User> {
  const gqlQuery = gql`
    query GetUser($params: UserQueryParams) {
      getUser(params: $params) {
        id
        isAdmin
        username
        displayName
        email
        emailLower
        twitterHandle
        profileImageUrl
        createDate
        products
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getUser as User;
}

export async function getUsers(params: UserQueryParams): Promise<User[]> {
  const gqlQuery = gql`
    query GetUsers($params: UserQueryParams) {
      getUsers(params: $params) {
        id
        username
        email
      }
    }
  `;
  const resp = await api().query({
    query: gqlQuery,
    variables: { params }
  });

  const data = resp.data as any;
  return data.getUsers as User[];
}

export async function updateUser(userId: string, userUpdates: Partial<User>): Promise<User> {
  const gqlMutation = gql`
    mutation updateUser($userId: String, $userUpdates: UserInput) {
      updateUser(userId: $userId, userUpdates: $userUpdates) {
        id
        username
        email
      }
    }
  `;
  const resp = await api().mutate({
    mutation: gqlMutation,
    variables: { userId, userUpdates }
  });

  const data = resp.data as any;
  return data.updateUser as User;
}
