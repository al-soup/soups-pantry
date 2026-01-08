import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/core/supabase.service';
import { GetHabitDto } from './dto/get-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getHabits(): Promise<GetHabitDto[]> {
    const data = await this.supabaseService.getHabits();
    const filteredHabits = data
      .filter((habit) => habit.completed_at !== null)
      .map((habit) => {
        const dto: GetHabitDto = {
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

  // async createHabit(createHabitDto: CreateHabitDto): Promise<GetHabitDto> {
  //   const data = await this.supabaseService.createHabit(createHabitDto);
  //   const dto: GetHabitDto = {
  //     action_id: data.action_id,
  //     completed_at: data.completed_at as string,
  //     id: data.id,
  //   };
  //   if (data.note) {
  //     dto.note = data.note;
  //   }

  //   return dto;
  // }
}
