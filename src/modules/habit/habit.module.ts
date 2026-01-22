import { Module } from '@nestjs/common';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';
import { SupabaseService } from 'src/core/supabase.service';

@Module({
  providers: [HabitService, SupabaseService],
  controllers: [HabitController],
})
export class HabitModule {}
