// E2E test setup file
// This ensures e2e tests always use local Supabase configuration

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Ensure we're not in production mode for e2e tests
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_ENV = 'test';
}
