import { ApiProperty } from '@nestjs/swagger';

export class SyncResponseDto {
  @ApiProperty({
    description: 'Whether the sync operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message describing the sync result',
    example: 'Data synchronized successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Total number of items processed',
    example: 150,
    required: false,
  })
  itemsProcessed?: number;

  @ApiProperty({
    description: 'Sync duration in milliseconds',
    example: 5000,
    required: false,
  })
  duration?: number;
}
