import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { SupabaseService } from 'src/core/supabase.service';

@Module({
  providers: [HabitsService, SupabaseService],
  controllers: [HabitsController],
})
export class HabitsModule {}
