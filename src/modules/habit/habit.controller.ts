import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetHabitDto } from './dto/get-habit.dto';
import { HabitService } from './habit.service';

@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all habits',
    description: 'Retrieves a list of all habits',
    tags: ['habit'],
  })
  @ApiOkResponse({ type: [GetHabitDto] })
  async findAll(): Promise<GetHabitDto[]> {
    const habits = await this.habitService.getHabits();

    return habits.filter((habit) => habit.completed_at !== null);
  }

  // TODO implement 404 and 500

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single habit',
    description: 'Retrieves a single habit by ID',
    tags: ['habit'],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the habit to retrieve',
  })
  @ApiOkResponse({ type: GetHabitDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetHabitDto> {
    return this.habitService.getHabitById(id);
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
  //     // return this.habitService.createHabit(createHabitDto);
  //   }
}
