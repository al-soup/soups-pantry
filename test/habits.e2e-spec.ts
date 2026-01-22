import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GetHabitDto } from 'src/modules/habit/dto/get-habit.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { DEFAULT_LIMIT } from 'src/common/constants/pagination.constants';

describe('HabitController (e2e)', () => {
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
    it('should return a paginated response with default pagination', () => {
      return request(app.getHttpServer())
        .get('/habits')
        .expect(200)
        .expect((res) => {
          const response = res.body as PaginatedResponseDto<GetHabitDto>;
          console.log(response);

          expect(response).toHaveProperty('data');
          expect(response).toHaveProperty('meta');
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBeGreaterThan(0);
          expect(response.data[0]).toHaveProperty('id');
          expect(response.meta).toHaveProperty('total');
          expect(response.meta).toHaveProperty('page');
          expect(response.meta).toHaveProperty('limit');
          expect(response.meta).toHaveProperty('totalPages');
          expect(response.meta).toHaveProperty('hasNextPage');
          expect(response.meta).toHaveProperty('hasPreviousPage');
          expect(response.meta.page).toBe(1);
          expect(response.meta.limit).toBe(DEFAULT_LIMIT);
        });
    });

    it('should return paginated response with custom page and limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/habits?page=1&limit=5')
        .expect(200);

      const body = response.body as PaginatedResponseDto<GetHabitDto>;

      expect(body.data.length).toBeLessThanOrEqual(5);
      expect(body.meta.page).toBe(1);
      expect(body.meta.limit).toBe(5);
      expect(body.meta.totalPages).toBeGreaterThanOrEqual(1);
    });

    it('should handle pagination metadata correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/habits?page=1&limit=10')
        .expect(200);

      const body = response.body as PaginatedResponseDto<GetHabitDto>;

      expect(body.meta.total).toBeGreaterThanOrEqual(0);
      expect(body.meta.totalPages).toBe(
        Math.ceil(body.meta.total / body.meta.limit),
      );
      expect(body.meta.hasNextPage).toBe(body.meta.page < body.meta.totalPages);
      expect(body.meta.hasPreviousPage).toBe(body.meta.page > 1);
    });

    it('should reject limit exceeding max limit (200)', () => {
      return request(app.getHttpServer())
        .get('/habits?page=1&limit=201')
        .expect(400);
    });

    it('should reject invalid page number (less than 1)', () => {
      return request(app.getHttpServer()).get('/habits?page=0').expect(400);
    });

    it('should reject invalid limit (less than 1)', () => {
      return request(app.getHttpServer()).get('/habits?limit=0').expect(400);
    });

    it('should handle last page correctly', async () => {
      // First, get total count
      const firstResponse = await request(app.getHttpServer())
        .get('/habits?page=1&limit=20')
        .expect(200);

      const firstBody = firstResponse.body as PaginatedResponseDto<GetHabitDto>;
      const totalPages = firstBody.meta.totalPages;

      if (totalPages > 1) {
        const lastPageResponse = await request(app.getHttpServer())
          .get(`/habits?page=${totalPages}&limit=20`)
          .expect(200);

        const lastPageBody =
          lastPageResponse.body as PaginatedResponseDto<GetHabitDto>;

        expect(lastPageBody.meta.page).toBe(totalPages);
        expect(lastPageBody.meta.hasNextPage).toBe(false);
        expect(lastPageBody.meta.hasPreviousPage).toBe(totalPages > 1);
      }
    });
  });

  describe('GET /habits/:id', () => {
    it('should return a single habit by id', async () => {
      // First, get all habits to find a valid ID
      const allHabitsResponse = await request(app.getHttpServer())
        .get('/habits')
        .expect(200);

      const paginatedResponse =
        allHabitsResponse.body as PaginatedResponseDto<GetHabitDto>;
      expect(paginatedResponse.data.length).toBeGreaterThan(0);

      const habitId = paginatedResponse.data[0].id;

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

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer()).get('/habits/999999').expect(404);
    });
  });
});
