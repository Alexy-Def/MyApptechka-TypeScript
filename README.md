# NestJS Project Template

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

Note, installing `@ppx/schematics` package with `yarn` would not work

## Running the app

```bash
# development
$ npm run start:api

# watch mode
$ npm run start:api:dev

# production mode
$ npm run start:api:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Sentry setup
1. Create a new project in sentry. If the team does not exist, create it, you can do it in the [same menu](https://sentry.pixelplex.by/organizations/pixelplex/projects/new/), and you need to be an Admin.
2. Employees need to log in to the sentry for the first time in order for their account to appear. Then you can add them to the team.
3. Then you need to take dsn and put it in the project config.
4. To set up alert rules, you need to create a chat in slack and then create a rule in sentry, following the example of another project.

## License

Nest is [MIT licensed](LICENSE).
