import { Body, Controller, Get, Post } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitResponseDto } from './dto/habits-response.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all habits',
    description: 'Retrieves a list of all habits from the database',
    tags: ['habits'],
  })
  @ApiOkResponse({ type: [HabitResponseDto] })
  async findAll(): Promise<HabitResponseDto[]> {
    const habits = await this.habitsService.getAllHabits();

    return habits.filter((habit) => habit.completed_at !== null);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new habit',
    description: 'Creates a new habit in the database',
    tags: ['habits'],
  })
  @ApiCreatedResponse({
    type: HabitResponseDto,
    description: 'The habit has been successfully created',
  })
  async create(
    @Body() createHabitDto: CreateHabitDto,
  ): Promise<HabitResponseDto> {
    return this.habitsService.createHabit(createHabitDto);
  }
}
