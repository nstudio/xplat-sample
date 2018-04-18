# SketchPoints Backend

This is the backend (mostly an API) for the SketchPoints apps.

## API Installation & Running

* Install [Node.js](https://nodejs.org/en/)
* `cd backend-api`
* `npm run setup`
* `npm run build`
* `npm start`

At this point you'll have a local GraphQL dev server running at:
http://localhost:4000/graphql

You can also access a local GraphiQL instance at:
http://localhost:4000/graphiql

## Running The Tests

The tests use [jest](https://facebook.github.io/jest/).

 * `npm test`
 * `npm run test-integration`
 * `npm run test-e2e` (the API must be running for this to work)
