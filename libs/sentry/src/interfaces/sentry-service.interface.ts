export interface ISentryService {
  init(serverName: string): void;
  install(): void;
  warning(message: string, additionalData?: Record<string, unknown>): void;
  message(message: string, additionalData?: Record<string, unknown>): void;
  error(error: Error, additionalData?: Record<string, unknown>): void;
}
