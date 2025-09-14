import { createResponse } from '@/common/interfaces/response.interface';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SyncResponseDto } from './dto/sync-response.dto';
import { TftService } from './tft.service';

@ApiTags('tft')
@Controller('tft')
export class TftController {
  constructor(private readonly tftService: TftService) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sync TFT data from external APIs',
    description:
      'Fetches and synchronizes TFT data from metatft.com APIs for both Vietnamese and English languages. Automatically uses the default TFT set configured in the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data synchronized successfully',
    type: SyncResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during sync',
  })
  async syncData() {
    const result = await this.tftService.syncTftData();

    if (result.success) {
      return createResponse(null, result.message, 200);
    } else {
      return createResponse(null, result.message, 500);
    }
  }

  @Get('sets')
  @ApiOperation({
    summary: 'Get all TFT Set configurations',
    description:
      'Returns list of all TFT sets with their sync status and API configurations.',
  })
  @ApiResponse({
    status: 200,
    description: 'TFT sets retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getTftSets() {
    const sets = await this.tftService.getAllTftSets();
    return createResponse(sets, 'TFT sets retrieved successfully', 200);
  }
}
