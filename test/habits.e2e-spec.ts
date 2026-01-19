import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GetHabitDto } from 'src/modules/habit/dto/get-habit.dto';

describe('HabitsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /habits', () => {
    it('should return an array of habits', () => {
      return request(app.getHttpServer())
        .get('/habits')
        .expect(200)
        .expect((res) => {
          const habits = res.body as Array<GetHabitDto>;

          expect(Array.isArray(habits)).toBe(true);
          expect(habits.length).toBeGreaterThan(0);
          expect(habits[0]).toHaveProperty('id');
        });
    });
  });

  describe('GET /habits/:id', () => {
    it('should return a single habit by id', async () => {
      // First, get all habits to find a valid ID
      const allHabitsResponse = await request(app.getHttpServer())
        .get('/habits')
        .expect(200);

      const habits = allHabitsResponse.body as Array<GetHabitDto>;
      expect(habits.length).toBeGreaterThan(0);

      const habitId = habits[0].id;

      // Then, get the specific habit
      return request(app.getHttpServer())
        .get(`/habits/${habitId}`)
        .expect(200)
        .expect((res) => {
          const habit = res.body as GetHabitDto;

          expect(habit).toHaveProperty('id');
          expect(habit).toHaveProperty('action_id');
          expect(habit).toHaveProperty('completed_at');
          expect(habit.id).toBe(habitId);
        });
    });

    it('should return 400 for invalid id', () => {
      return request(app.getHttpServer()).get('/habits/invalid').expect(400);
    });
  });
});
