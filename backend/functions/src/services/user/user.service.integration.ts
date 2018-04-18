import { createUser, deleteUsers } from './user.service';

it('should create a new user', async () => {
  const user = await createUser({ username: 'foo' });

  console.log('got user of ' + JSON.stringify(user, null, 2));

  expect(user).toBeTruthy();
  expect(user.id).toBeTruthy();
});

// delete all the fake data we put in
afterAll(async () => {
  await deleteUsers({ match: { username: 'foo' } });
});
