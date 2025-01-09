import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { ValidationDetail, ValidationError as InternalValidationError } from '@modules/core/exceptions';

export class ClassValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    if (!metadata.metatype) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new InternalValidationError(this.expandError(errors));
    }

    return object;
  }

  expandError(errors: ValidationError[]): ValidationDetail[] {
    const details: ValidationDetail[] = [];
    errors.forEach(({ property, contexts, children, constraints }) => {
      if (children) {
        this.expandError(children).forEach((error) => {
          details.push(error);
        });
      }

      if (constraints) {
        Object.keys(constraints).forEach((key) => {
          details.push({
            ...(contexts && { context: contexts[key] }),
            target: property,
            message: constraints[key].replace(property, '').trim().toUpperCase(),
          });
        });
      }
    });

    return details;
  }
}
