import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from 'src/core/supabase.service';
import { supabaseMock } from 'test/mocks/supabase.mock';
import { HabitsService } from './habits.service';
import { Tables } from 'src/common/types/database.types';

describe('HabitsService', () => {
  let service: HabitsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        HabitsService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return habit dtos', async () => {
    const habits: Array<Tables<'habit'>> = [
      {
        id: 1,
        action_id: 123,
        completed_at: '2024-06-01T12:00:00Z',
        created_at: '2024-06-01T10:00:00Z',
        note: 'Test note',
      },
      {
        id: 2,
        action_id: 456,
        completed_at: null,
        created_at: '2024-06-01T10:00:00Z',
        note: null,
      },
      {
        id: 3,
        action_id: 789,
        completed_at: '2024-06-02T12:00:00Z',
        created_at: '2024-06-02T10:00:00Z',
        note: null,
      },
    ];

    supabaseMock.getHabits.mockResolvedValue(habits);

    const result = await service.getHabits();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      action_id: 123,
      completed_at: '2024-06-01T12:00:00Z',
      note: 'Test note',
    });
    expect(result[1]).toEqual({
      id: 3,
      action_id: 789,
      completed_at: '2024-06-02T12:00:00Z',
    });
    expect(supabaseMock.getHabits).toHaveBeenCalledTimes(1);
  });
});
