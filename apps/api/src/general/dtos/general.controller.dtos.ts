import { ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';

export class GetHelloResponseDTO {
  @Expose()
  @ApiPropertyString()
  result: string;
}
