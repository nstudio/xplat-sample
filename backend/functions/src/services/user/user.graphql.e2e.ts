import { getUser } from './user.graphql.client';

it('should be true', () => {
  expect({}).toBeTruthy();
});

it('should get a user', async () => {
  const user = await getUser({ match: { username: 'foo' } });
  expect(user).toBeTruthy();
});

// it('should get multiple users', async () => {
//   const users = await getUsers({ match: { username: 'foo' } });
//   expect(users).toBeTruthy();
//   expect(users.length).toBeTruthy();
//   expect(users[0].id).toBeTruthy();
// });

// it('should update a user', async () => {
//   const user = await updateUser('Gv7yiy3mKIuylUEwlQ8C', { email: 'foo@moo.com' });
//   expect(user).toBeTruthy();
//   expect(user.id).toBeTruthy();
// });
