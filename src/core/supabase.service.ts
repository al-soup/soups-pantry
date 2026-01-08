import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ENV_SUPABASE_SECRET_KEY,
  ENV_SUPABASE_URL,
} from 'src/common/constants/database.constants';
import { Database, Tables } from 'src/common/types/database.types';
import { CreateHabitDto } from 'src/modules/habits/dto/create-habit.dto';

@Injectable()
export class SupabaseService {
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

  // TODO implement pagination
  async getHabits(): Promise<Array<Tables<'habit'>>> {
    const { data, error } = await this.supabase
      .from('habit')
      .select('*')
      .limit(10);
    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // TODO create return type
  // TODO extend mock
  // TODO look into error handling
  async createHabit(createHabitDto: CreateHabitDto) {
    const { data, error } = await this.supabase
      .from('habit')
      .insert([createHabitDto])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
