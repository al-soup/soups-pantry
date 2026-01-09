import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitsModule } from './modules/habits/habits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load environment files in order of priority (later files override earlier ones)
      envFilePath: [
        '.env',
        // Only load .env.local if NODE_ENV is not explicitly set to production
        // This allows .env.production to override .env.local when NODE_ENV=production
        ...(process.env.NODE_ENV !== 'production' ? ['.env.local'] : []),
        `.env.${process.env.NODE_ENV || 'development'}`,
        `.env.${process.env.NODE_ENV || 'development'}.local`,
      ],
    }),
    HabitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
