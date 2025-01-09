import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthCheckService } from '../services';

@Controller('health-check')
@ApiTags('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async checkHealth(): Promise<void> {
    await this.healthCheckService.checkHealth();
  }
}
