import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  let service: HabitsService;

  const testConfig = {
    SUPABASE_URL: 'https://mock-supabase-url.supabase.co',
    SUPABASE_SECRET_KEY: 'mock-secret-key',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => testConfig)],
      providers: [HabitsService],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
