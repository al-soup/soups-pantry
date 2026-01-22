import { PaginationMetaDto } from '../dto/pagination-meta.dto';

/**
 * Calculate the offset from page number and limit
 * @param page 1-based page number
 * @param limit Number of items per page
 * @returns Offset value for database queries
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate pagination metadata from total count, page, and limit
 * @param total Total number of items
 * @param page Current page number (1-based)
 * @param limit Number of items per page
 * @returns Pagination metadata object
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMetaDto {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}
