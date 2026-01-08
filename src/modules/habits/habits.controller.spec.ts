import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from 'src/core/supabase.service';
import { supabaseMock } from 'test/mocks/supabase.mock';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { GetHabitDto } from './dto/get-habit.dto';

describe('HabitsController', () => {
  let controller: HabitsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        HabitsService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
      controllers: [HabitsController],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return filtered habits', async () => {
    const habitDtos: Array<GetHabitDto> = [
      {
        id: 1,
        action_id: 123,
        completed_at: '2024-06-01T12:00:00Z',
        note: 'Test note',
      },
      {
        id: 2,
        action_id: 456,
        completed_at: '2024-06-02T12:00:00Z',
      },
    ];

    const habitsService = module.get<HabitsService>(HabitsService);
    const getHabitsSpy = jest
      .spyOn(habitsService, 'getHabits')
      .mockResolvedValue(habitDtos);

    const result = await controller.findAll();

    expect(result).toEqual(habitDtos);
    expect(getHabitsSpy).toHaveBeenCalledTimes(1);
  });
});
