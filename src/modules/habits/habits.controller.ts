import { Controller, Get } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitResponseDto } from './dto/habits-response.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async findAll(): Promise<HabitResponseDto[]> {
    const habits = await this.habitsService.getAllHabits();

    return habits.filter((habit) => habit.completed_at !== null);
  }
}
