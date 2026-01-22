import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { GetHabitDto } from './get-habit.dto';

export class PaginatedHabitsResponseDto extends PaginatedResponseDto<GetHabitDto> {
  @ApiProperty({
    type: [GetHabitDto],
    description: 'Array of habits',
  })
  declare data: GetHabitDto[];
}
