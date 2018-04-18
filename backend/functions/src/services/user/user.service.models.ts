export interface User {
  id?: string;
  isAdmin?: boolean;
  username?: string;
  displayName?: string;
  email?: string;
  emailLower?: string;
  twitterHandle?: string;
  profileImageUrl?: string;
  createDate?: Date;
  firebaseAuthData?: any;
  products?: Array<string>;
}

export interface UserQueryParams {
  match?: Partial<User>;
  limit?: number;
}

export interface UserSession {
  currentUser?: User;
}
