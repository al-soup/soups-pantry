import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GetHabitDto } from 'src/modules/habits/dto/get-habit.dto';

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
});
