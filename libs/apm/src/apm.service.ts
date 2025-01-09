import { Injectable } from '@nestjs/common';
import apm from 'elastic-apm-node';
import _ from 'lodash';

import { InjectLogger, Logger } from '@libs/nestjs-logger';

@Injectable()
export class ApmService {
  @InjectLogger() private readonly logger: Logger;

  private readonly apm: apm.Agent;

  constructor() {
    this.apm = apm;
  }

  /**
   * Returns the apm agent instance.
   */
  getAgent(): apm.Agent {
    return this.apm;
  }

  /**
   * Sends an error to the apm agent
   */
  captureError(err: string | Error | apm.ParameterizedMessageObject): void {
    this.apm.captureError(err);
  }

  startTransactionOrSpan(
    name: string,
    labels?: Array<{ name: string; value: string }>,
  ): apm.Transaction | apm.Span | null {
    let result: apm.Transaction | apm.Span | null;

    if (apm.currentTransaction) {
      result = this.startSpan(name, { childOf: apm.currentTransaction, exitSpan: false });
    } else {
      result = this.startTransaction(name);
    }

    if (_.isEmpty(result)) {
      this.logger.warn('Cannot create transaction or span');

      return null;
    }

    result.setType('business-logic');

    for (const label of _.castArray(labels)) {
      result.setLabel(label.name, label.value);
    }

    return result;
  }

  /**
   * Starts new transaction record.
   */
  startTransaction(name?: string, options?: apm.TransactionOptions): apm.Transaction | null {
    return this.apm.startTransaction(name, options);
  }

  /**
   * Renames transaction
   */
  setTransactionName(name: string): void {
    this.apm.setTransactionName(name);
  }

  /**
   * Creates a new span (aka block) in the current transaction
   */
  startSpan(name?: string, options?: apm.SpanOptions): apm.Span | null {
    return this.apm.startSpan(name, options);
  }

  /**
   * Sets custom contract properties to the current transaction state
   */
  setCustomContext(context: Record<string, unknown>): void {
    this.apm.setCustomContext(context);
  }
}
