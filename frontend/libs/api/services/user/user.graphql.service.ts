import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { User, UserQueryParams } from './user.model';

@Injectable()
export class ApiUser {
  constructor(private _apollo: Apollo) {}

  // easy for now
  public static token: { value: string; date: number };

  public me() {
    const gqlQuery = gql`
      query Me {
        me {
          id
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
    return this._apollo
      .query({
        query: gqlQuery
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.me as User;
        })
      );
  }

  public getUser(params: UserQueryParams) {
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
    return this._apollo
      .query({
        query: gqlQuery,
        variables: { params }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.getUser as User;
        })
      );
  }

  public getUsers(params: UserQueryParams) {
    const gqlQuery = gql`
      query GetUsers($params: UserQueryParams) {
        getUsers(params: $params) {
          id
          username
          displayName
          email
          twitterHandle
          profileImageUrl
        }
      }
    `;
    return this._apollo
      .query({
        query: gqlQuery,
        variables: { params }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.getUsers as User[];
        })
      );
  }

  public updateUser(userId: string, userUpdates: Partial<User>) {
    const gqlMutation = gql`
      mutation updateUser($userId: String, $userUpdates: UserInput) {
        updateUser(userId: $userId, userUpdates: $userUpdates) {
          id
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
    return this._apollo
      .mutate({
        mutation: gqlMutation,
        variables: { userId, userUpdates }
      })
      .pipe(
        map(resp => {
          const data = resp.data as any;
          return data.updateUser as User;
        })
      );
  }
}
