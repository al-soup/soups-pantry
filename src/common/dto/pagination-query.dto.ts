import { Type } from 'class-transformer';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../constants/pagination.constants';
import { NumberApiProperty } from '../pipes';

export class PaginationQueryDto {
  @Type(() => Number)
  @NumberApiProperty({
    example: 1,
    description: 'Page number (1-based)',
    optional: true,
    min: 1,
    default: 1,
  })
  page?: number = 1;

  @Type(() => Number)
  @NumberApiProperty({
    example: DEFAULT_LIMIT,
    description: `Number of items per page (max: ${DEFAULT_LIMIT})`,
    optional: true,
    default: DEFAULT_LIMIT,
    min: 1,
    max: MAX_LIMIT,
  })
  limit?: number = DEFAULT_LIMIT;
}
