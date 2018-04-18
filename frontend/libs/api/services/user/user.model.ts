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

export function getUserCoinsAndBadges(user: User): { coins: number; badges: Array<string> } {
  let coins = 0;
  const badges = [];
  if (user && user.products) {
    // how many coins they have
    // 'coinsp:[total]'
    // what badges they have redeemed
    // '[badgeId]'
    for (const p of user.products) {
      if (p.indexOf('coinsp:') > -1) {
        const total = +p.split(':')[1];
        coins += total;
      } else if (p.indexOf('badge-') > -1) {
        badges.push(p);
      }
    }
  }
  return {
    coins,
    badges
  };
}
