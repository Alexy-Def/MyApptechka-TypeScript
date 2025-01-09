import { Injectable } from '@nestjs/common';

import { GetHelloResponseDTO } from '../dtos';

@Injectable()
export class GeneralService {
  async helloWorld(): Promise<GetHelloResponseDTO> {
    return Promise.resolve({ result: 'hello world' });
  }
}
