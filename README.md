# Soup's Pantry 🥫

A collection of my APIs.

## Folder Structure

```text
src/
├── core/ # App-wide infrastructure (auth, redis, mail, etc)
├── common/ # Generic, reusable utilities (pipes, decorators, types)
├── integrations/ # External/Internal service wrappers (Stripe, AWS client)
├── modules/ # Domain-driven modules (user, account, payment)
├── events/ # Domain event publishers/listeners
├── commands/ # CLI jobs, CRON logic
├── app.module.ts
└── main.ts
```

### File Placement Decision Tree

- Business feature? → *modules/[feature]/*
- DTO? → *modules/[feature]/dto/*
- Decorator or utility?
  - Module-specific? → *modules/[feature]/utils/*
  - Global/shared? → *common/utils/*
- Auth/redis config? → *core/*
- External service wrapper? → *integrations/*
- CLI job? → *commands/*

## Naming Conventions

| Type         | Convention                    | Example                       |
|--------------|-------------------------------|-------------------------------|
| Domain Folder| Singular                      | payee/, account/              |
| Reusable Code| Plural                        | pipes/, utils/                |
| Service      | [name].service.ts             | user.service.ts              |
| Module       | [name].module.ts              | auth.module.ts                |
| DTO          | [action]-[entity].dto.ts      | create-user.dto.ts           |
| Client       | [provider]-[entity].client.ts | stripe-payment.client.ts      |
| Guard/Pipe   | [name].guard.ts / .pipe.ts    | jwt.guard.ts                  |

## Testing Rules

| Type       | Location                      | Example                  |
|------------|-------------------------------|--------------------------|
| Unit Test  | Beside implementation file    | user.service.spec.ts     |
| E2E Test   | In test/ or e2e/ folder       | user.e2e-spec.ts         |

## TODO

- [ ] Test the validator decorators
- [ ] Move common descriptions of the api to a variable

## Future Plans

- [ ] Create a CRON that checks the [Strava API](https://developers.strava.com/docs/getting-started/) daily and creates entries for cycling
