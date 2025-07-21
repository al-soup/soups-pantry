import { NumberApiProperty, StringApiProperty } from 'src/common/decorators';

export class CreateHabitDto {
  @NumberApiProperty({
    example: 123,
    description: 'Which action was completed with the habit',
  })
  action_id: number;

  @StringApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time the habit was completed',
    nullable: false,
  })
  completed_at: string;

  @StringApiProperty({
    example: 'This is a note',
    description: 'The note for the habit',
    optional: true,
  })
  note?: string;
}
