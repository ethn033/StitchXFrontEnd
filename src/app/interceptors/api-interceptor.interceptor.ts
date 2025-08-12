import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { ProblemDetails } from '../models/error-response';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      if (isProblemDetails(error.error)) {
        const problemDetails = error.error;
        return throwError(() => problemDetails);
      }
      // Handle standard HTTP errors
      const message = getHttpErrorMessage(error);
      return throwError(() => error);
    })
  );
};

function isProblemDetails(obj: any): obj is ProblemDetails {
  return obj && 'type' in obj && 'title' in obj;
}

function getHttpErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return 'Network error - please check your connection';
    case 400:
      return 'Invalid request';
    case 401:
      return 'Please login again';
    case 403:
      return 'You don\'t have permission';
    case 404:
      return 'Resource not found';
    case 500:
      return 'Server error - please try again later';
    default:
      return error.message || 'An unexpected error occurred';
  }
}