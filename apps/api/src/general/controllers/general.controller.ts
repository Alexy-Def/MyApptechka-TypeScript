import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseInfo } from '@modules/core/api-responses';

import { GetHelloResponseDTO } from '../dtos';
import { GeneralService } from '../services';

@Controller('general')
@ApiTags('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Get()
  @ResponseInfo({ type: GetHelloResponseDTO })
  async hello(): Promise<GetHelloResponseDTO> {
    return this.generalService.helloWorld();
  }
}
