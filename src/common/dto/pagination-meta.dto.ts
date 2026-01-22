import { BooleanApiProperty, NumberApiProperty } from 'src/common/pipes';

export class PaginationMetaDto {
  @NumberApiProperty({
    example: 100,
    description: 'Total number of items',
    readOnly: true,
  })
  total: number;

  @NumberApiProperty({
    example: 1,
    description: 'Current page number',
    readOnly: true,
  })
  page: number;

  @NumberApiProperty({
    example: 20,
    description: 'Number of items per page',
    readOnly: true,
  })
  limit: number;

  @NumberApiProperty({
    example: 5,
    description: 'Total number of pages',
    readOnly: true,
  })
  totalPages: number;

  @BooleanApiProperty({
    example: true,
    description: 'Whether there is a next page',
    readOnly: true,
  })
  hasNextPage: boolean;

  @BooleanApiProperty({
    example: false,
    description: 'Whether there is a previous page',
    readOnly: true,
  })
  hasPreviousPage: boolean;
}
