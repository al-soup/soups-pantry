import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ENV_SUPABASE_SECRET_KEY,
  ENV_SUPABASE_URL,
} from 'src/common/constants/database.constants';
import { Database } from 'src/common/types/database.types';
import { HabitResponseDto } from './dto/habits-response.dto';

@Injectable()
export class HabitsService {
  private supabase: SupabaseClient<Database>;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = configService.get<string>(ENV_SUPABASE_URL);
    const supabaseKey = configService.get<string>(ENV_SUPABASE_SECRET_KEY);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        `${ENV_SUPABASE_URL} or ${ENV_SUPABASE_SECRET_KEY} is not set`,
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAllHabits(): Promise<HabitResponseDto[]> {
    const { data, error } = await this.supabase.from('habit').select('*');
    if (error) {
      throw new Error(error.message);
    }

    const filteredHabits = data
      .filter((habit) => habit.completed_at !== null)
      .map((habit) => {
        const dto: HabitResponseDto = {
          action_id: habit.action_id,
          completed_at: habit.completed_at as string,
          id: habit.id,
        };
        if (habit.note) {
          dto.note = habit.note;
        }
        return dto;
      });

    return filteredHabits;
  }
}
