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

### Naming Conventions

| Type         | Convention                    | Example                       |
|--------------|-------------------------------|-------------------------------|
| Domain Folder| Singular                      | payee/, account/              |
| Reusable Code| Plural                        | pipes/, utils/                |
| Service      | [name].service.ts             | user.service.ts               |
| Module       | [name].module.ts              | auth.module.ts                |
| DTO          | [action]-[entity].dto.ts      | create-user.dto.ts            |
| Client       | [provider]-[entity].client.ts | stripe-payment.client.ts      |
| Guard/Pipe   | [name].guard.ts / .pipe.ts    | jwt.guard.ts                  |

## Testing

| Type       | Location                      | Example                  |
|------------|-------------------------------|--------------------------|
| Unit Test  | Beside implementation file    | user.service.spec.ts     |
| E2E Test   | In test/ or e2e/ folder       | user.e2e-spec.ts         |

### E2E Testing

E2E tests are automatically configured to use your local Supabase instance:

- Tests set `NODE_ENV=test` automatically, ensuring `.env.local` is loaded
- **Local Supabase is automatically started** before running e2e tests if it's not already running

**Running e2e tests:**

```bash
pnpm run test:e2e
```

**Note:** The test setup file (`test/setup-e2e.ts`) will run before e2e tests are started.

## Local Development

### Prerequisites

[Docker Desktop](https://docs.docker.com/desktop/) and [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) need to be installed.

### Setting up Supabase

This project uses Supabase for the database. To run Supabase locally:

1. **Start the local Supabase instance:**

   ```bash
   pnpm run supabase:start
   ```

2. **Get your local credentials:**

   ```bash
   pnpm run supabase:status
   ```

3. **Create environment configuration files:**

   The application supports environment-based configuration with the following priority (later files override earlier ones):

   - `.env` - Base configuration
   - `.env.local` - Local overrides (recommended for local development)
   - `.env.${NODE_ENV}` - Environment-specific (e.g., `.env.production`)
   - `.env.${NODE_ENV}.local` - Environment-specific local overrides

   **For local development**, create a `.env.local` file:

   ```env
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_SECRET_KEY=<your-secret-key-from-supabase-status>
   ```

   **For production (e.g. the remote Supabase)**, create a `.env.production` file:

   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=<your-the-remote-supabase-key>
   ```

   **Note:** The application will log which Supabase instance (LOCAL or REMOTE) it's connecting to when it starts.

4. **Start the DB:**

   - `pnpm run supabase:start` - Start local Supabase
   - `pnpm run supabase:stop` - Stop local Supabase
   - `pnpm run supabase:reset` - Reset the local database (applies migrations and seeds)

**Note:** The local Supabase instance runs on:

- API: <http://127.0.0.1:54321>
- Studio: <http://127.0.0.1:54323>
- Database: localhost:54322

### Syncing Schema from Production

To create the same database schema as your remote Supabase instance:

1. **Log into Supbase CLI and link to production project:**

   ```bash
   supabase login
   ```

   ```bash
   supabase link # and select project
   ```

2. **Pull the schema from production:**

   ```bash
   pnpm run supabase:pull
   ```

   This will create migration files in `supabase/migrations/` that match your production schema.

3. **Apply migrations to local database:**

   ```bash
   pnpm run supabase:reset
   ```

   This will:
   - Reset your local database
   - Apply all migrations from `supabase/migrations/`
   - Run the seed file (`supabase/seed.sql`) to populate sample data

4. **Additional schema commands:**

   - `pnpm run supabase:pull` - Pull schema changes from production
   - `pnpm run supabase:push` - Push local migrations to production (use with caution!)
   - `pnpm run supabase:diff` - Generate a migration file for differences between local and production

### Run the Application Locally

**Examples:**

```bash
# Use local Supabase (default)
pnpm run start:dev

# Use remote Supabase
NODE_ENV=production pnpm run start:dev
```

## TODO

- [ ] Test the validator decorators
- [ ] Move common descriptions of the api to a variable

## Future Plans

- [ ] Create a CRON that checks the [Strava API](https://developers.strava.com/docs/getting-started/) daily and creates entries for cycling
