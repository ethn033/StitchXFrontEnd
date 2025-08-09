// For error responses from ExceptionHandler
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  stackTrace?: string; // Only in development
  [key: string]: any; // For extensions
}