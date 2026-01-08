import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetHabitDto } from './dto/get-habit.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all habits',
    description: 'Retrieves a list of all habits from the database',
    tags: ['habits'],
  })
  @ApiOkResponse({ type: [GetHabitDto] })
  async findAll(): Promise<GetHabitDto[]> {
    const habits = await this.habitsService.getAllHabits();

    return habits.filter((habit) => habit.completed_at !== null);
  }

  //   @Post()
  //   @ApiOperation({
  //     summary: 'Create a new habit',
  //     description: 'Creates a new habit in the database',
  //     tags: ['habits'],
  //   })
  //   @ApiCreatedResponse({
  //     type: HabitResponseDto,
  //     description: 'The habit has been successfully created',
  //   })
  //   async create(
  //     @Body() createHabitDto: CreateHabitDto,
  //   ): Promise<HabitResponseDto> {
  //     console.log(createHabitDto);
  //     return {
  //       action_id: 0,
  //       completed_at: new Date().toISOString(),
  //       id: 1,
  //     };
  //     // return this.habitsService.createHabit(createHabitDto);
  //   }
}
