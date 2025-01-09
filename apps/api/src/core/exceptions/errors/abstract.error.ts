import { ERROR_TYPE } from '../constants';

export type ErrorDetail = {
  field?: string;
  message: string;
  details?: { [key: string]: any };
  type?: ERROR_TYPE;
};

export type ErrorOptions = {
  cause?: { [key: string]: any };
  details?: { [key: string]: any }[];
};

export interface IAbstractError {
  readonly name: ERROR_TYPE;
  readonly message: string;
  readonly details: { [key: string]: any }[];
  readonly cause: { [key: string]: any } | null;
}

export class AbstractError extends Error implements IAbstractError {
  // Name of the type of error
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name
  readonly name: ERROR_TYPE;

  // Error message with common error information
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message
  readonly message: string;

  // Details of error. Should not include any private information
  // the info from the field can be provided to end client (for example as a response for http request)
  readonly details: { [key: string]: any }[] = [];

  // The specific original cause of an error. Should not be sent to the end client, only for internal usage
  // can include internal information but not private (can include path to the file but cannot include password)
  // the information from the field can be used as part of the message in Sentry
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
  readonly cause: { [key: string]: any } | null = null;

  constructor(name: ERROR_TYPE, message: string, options?: ErrorOptions) {
    super();
    this.name = name;
    this.message = message;
    this.details = options?.details || [];
    this.cause = options?.cause || null;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString
   */
  public toString(): string {
    return `${this.name}: ${this.message}. Details: ${JSON.stringify(this.details)}`;
  }
}
