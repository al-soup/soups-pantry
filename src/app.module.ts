import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HabitModule } from './modules/habit/habit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load environment files in order of priority (later files override earlier ones)
      // Env vars set in process.env take precedence over env files
      envFilePath: [
        '.env',
        // Only load .env.local if NODE_ENV is not explicitly set to production
        // This allows .env.production to override .env.local when NODE_ENV=production
        // For e2e tests (NODE_ENV=test), .env.local will be loaded to use local Supabase
        ...(process.env.NODE_ENV !== 'production' ? ['.env.local'] : []),
        `.env.${process.env.NODE_ENV || 'development'}`,
        `.env.${process.env.NODE_ENV || 'development'}.local`,
      ],
    }),
    HabitModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
