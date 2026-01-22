import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constants';
import {
  calculateOffset,
  calculatePaginationMeta,
} from 'src/common/utils/pagination.util';
import { SupabaseService } from 'src/core/supabase.service';
import { GetHabitDto } from './dto/get-habit.dto';

@Injectable()
export class HabitService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getHabits(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<GetHabitDto>> {
    const { page = 1, limit = DEFAULT_LIMIT } = paginationQuery;

    const offset = calculateOffset(page, limit);

    const [habits, total] = await Promise.all([
      this.supabaseService.getCompletedHabits(limit, offset),
      this.supabaseService.getCompletedHabitsCount(),
    ]);

    // Map to DTOs
    const data = habits.map((habit) => {
      const dto: GetHabitDto = {
        action_id: habit.action_id,
        completed_at: habit.completed_at ?? '',
        id: habit.id,
      };
      if (habit.note) {
        dto.note = habit.note;
      }
      return dto;
    });

    const meta = calculatePaginationMeta(total, page, limit);

    return new PaginatedResponseDto(data, meta);
  }

  async getHabitById(id: number): Promise<GetHabitDto> {
    const habit = await this.supabaseService.getHabitById(id);

    const dto: GetHabitDto = {
      action_id: habit.action_id,
      completed_at: habit.completed_at ?? '',
      id: habit.id,
    };
    if (habit.note) {
      dto.note = habit.note;
    }

    return dto;
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
