import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from 'src/core/supabase.service';
import { supabaseMock } from 'test/mocks/supabase.mock';
import { HabitService } from './habit.service';
import { Tables } from 'src/common/types/database.types';

describe('HabitService', () => {
  let service: HabitService;
  let module: TestingModule;

  const habits: Array<Tables<'habit'>> = [
    {
      id: 1,
      action_id: 123,
      completed_at: '2024-06-01T12:00:00Z',
      created_at: '2024-06-01T10:00:00Z',
      note: 'Test note',
    },
    {
      id: 3,
      action_id: 789,
      completed_at: '2024-06-02T12:00:00Z',
      created_at: '2024-06-02T10:00:00Z',
      note: null,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        HabitService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<HabitService>(HabitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a paginated response', async () => {
    supabaseMock.getCompletedHabits.mockResolvedValue(habits);
    supabaseMock.getCompletedHabitsCount.mockResolvedValue(habits.length);

    const result = await service.getHabits({ page: 1, limit: 1 });

    expect(result.meta).toBeDefined();
    expect(result.meta.total).toBe(2);
    expect(result.meta.page).toBe(1);
    expect(result.meta.totalPages).toBe(2);
    expect(result.meta.hasNextPage).toBe(true);
  });

  it('should contain habit dtos', async () => {
    supabaseMock.getHabits.mockResolvedValue(habits);

    const result = await service.getHabits({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({
      id: 1,
      action_id: 123,
      completed_at: '2024-06-01T12:00:00Z',
      note: 'Test note',
    });
    expect(supabaseMock.getCompletedHabits).toHaveBeenCalledTimes(1);
    expect(supabaseMock.getCompletedHabitsCount).toHaveBeenCalledTimes(1);
  });
});
