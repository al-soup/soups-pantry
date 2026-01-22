import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  PostgrestError,
  SupabaseClient,
} from '@supabase/supabase-js';
import {
  ENV_SUPABASE_SECRET_KEY,
  ENV_SUPABASE_URL,
} from 'src/common/constants/database.constants';
import { Database, Tables } from 'src/common/types/database.types';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient<Database>;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = configService.get<string>(ENV_SUPABASE_URL);
    const supabaseKey = configService.get<string>(ENV_SUPABASE_SECRET_KEY);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        `${ENV_SUPABASE_URL} or ${ENV_SUPABASE_SECRET_KEY} is not set`,
      );
    }

    const isLocal =
      supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost');
    const maskedUrl = isLocal
      ? supabaseUrl
      : supabaseUrl.replace(/https?:\/\/([^.]+)\./, 'https://***.');
    this.logger.log(
      `Connecting to ${isLocal ? 'LOCAL' : 'REMOTE'} Supabase instance: ${maskedUrl}`,
    );

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Maps Supabase PostgrestError to appropriate NestJS HTTP exceptions
   */
  private handleSupabaseError(error: PostgrestError): never {
    // Log the error for debugging
    this.logger.error(
      `Supabase error: ${error.code} - ${error.message}`,
      error.details || error.hint,
    );

    // PGRST116: The result contains 0 rows (not found)
    if (error.code === 'PGRST116') {
      throw new NotFoundException('Resource not found');
    }

    // PostgreSQL constraint violation error codes
    // 23505: unique_violation
    // 23503: foreign_key_violation
    // 23502: not_null_violation
    if (
      error.code === '23505' ||
      error.code === '23503' ||
      error.code === '23502'
    ) {
      throw new BadRequestException(
        error.message || 'Database constraint violation',
      );
    }

    // For other errors, throw internal server error
    throw new InternalServerErrorException(
      'An unexpected database error occurred',
    );
  }

  async getHabits(
    limit?: number,
    offset?: number,
  ): Promise<Array<Tables<'habit'>>> {
    let query = this.supabase.from('habit').select('*');

    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      this.handleSupabaseError(error);
    }

    return data || [];
  }

  async getCompletedHabits(
    limit: number,
    offset: number,
  ): Promise<Array<Tables<'habit'>>> {
    const { data, error } = await this.supabase
      .from('habit')
      .select('*')
      .not('completed_at', 'is', null)
      .range(offset, offset + limit - 1);

    if (error) {
      this.handleSupabaseError(error);
    }

    return data || [];
  }

  async getCompletedHabitsCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('habit')
      .select('*', { count: 'exact', head: true })
      .not('completed_at', 'is', null);

    if (error) {
      this.handleSupabaseError(error);
    }

    return count || 0;
  }

  async getHabitsCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('habit')
      .select('*', { count: 'exact', head: true });
    if (error) {
      this.handleSupabaseError(error);
    }

    return count || 0;
  }

  async getHabitById(id: number): Promise<Tables<'habit'>> {
    const { data, error } = await this.supabase
      .from('habit')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      this.handleSupabaseError(error);
    }

    return data;
  }

  // async createHabit(createHabitDto: CreateHabitDto) {
  //   const { data, error } = await this.supabase
  //     .from('habit')
  //     .insert([createHabitDto])
  //     .select()
  //     .single();

  //   if (error) {
  //     this.handleSupabaseError(error);
  //   }

  //   if (!data) {
  //     throw new InternalServerErrorException(
  //       'Failed to create habit: no data returned',
  //     );
  //   }

  //   return data;
  // }
}
