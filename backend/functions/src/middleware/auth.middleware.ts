import * as lruCache from 'lru-cache';
import { HeaderNames, getFirebaseUserFromToken } from '../helpers';
import { createUser, getUser, updateUser, User } from '../services/user';

const userCache = lruCache<string, User>({ max: 1000, maxAge: 60000 });

export async function getUserFromToken(req: any, res: any, next: any) {
  const authHeader = req.header(HeaderNames.AUTHORIZATION) || '';
  const token = authHeader.replace(HeaderNames.BEARER + ' ', '');

  // if no token, don't do anything
  if (!token) {
    return next();
  }

  // if user in cache, just return the user
  let spUser = userCache.get(token);
  if (spUser) {
    req.currentUser = spUser;
    return next();
  }

  // else if we get here, reach out to firebase to validate the token
  const firebaseUser = await getFirebaseUserFromToken(token);

  // firebase user null if there is an issue with the token
  if (!firebaseUser) {
    return next();
  }

  const email = firebaseUser.email;
  const emailLower = email.toLowerCase();
  spUser = await getUser({ match: { emailLower: emailLower } });

  // if user doesn't already exist, create a new one based on the firebase user
  if (!spUser) {
    const user: User = {
      isAdmin: false,
      displayName: firebaseUser.displayName,
      username: email.split('@')[0].replace(/[^a-zA-Z]/g, '') + '-' + new Date().getTime(),
      email,
      emailLower,
      profileImageUrl: firebaseUser.photoURL
    };
    spUser = await createUser(user);
  }

  // update the firebase auth data whenever it has changed
  if (spUser && JSON.stringify(spUser.firebaseAuthData) !== JSON.stringify(firebaseUser)) {
    updateUser(spUser.id, { firebaseAuthData: firebaseUser }, spUser);
  }

  // save the user in cache for the next call
  if (spUser) {
    userCache.set(token, spUser);
  }

  // this value is taken by the graphql.middleware and put into the context for every graphql transaction
  req.currentUser = spUser;

  next();
}
