import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from 'src/core/supabase.service';
import { supabaseMock } from 'test/mocks/supabase.mock';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { GetHabitDto } from './dto/get-habit.dto';

describe('HabitController', () => {
  let controller: HabitController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        HabitService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
      controllers: [HabitController],
    }).compile();

    controller = module.get<HabitController>(HabitController);
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

    const habitService = module.get<HabitService>(HabitService);
    const getHabitsSpy = jest
      .spyOn(habitService, 'getHabits')
      .mockResolvedValue(habitDtos);

    const result = await controller.findAll();

    expect(result).toEqual(habitDtos);
    expect(getHabitsSpy).toHaveBeenCalledTimes(1);
  });

  it('should return a single habit by id', async () => {
    const habitDto: GetHabitDto = {
      id: 1,
      action_id: 123,
      completed_at: '2024-06-01T12:00:00Z',
      note: 'Test note',
    };

    const habitService = module.get<HabitService>(HabitService);
    const getHabitByIdSpy = jest
      .spyOn(habitService, 'getHabitById')
      .mockResolvedValue(habitDto);

    const result = await controller.findOne(1);

    expect(result).toEqual(habitDto);
    expect(getHabitByIdSpy).toHaveBeenCalledWith(1);
    expect(getHabitByIdSpy).toHaveBeenCalledTimes(1);
  });
});
