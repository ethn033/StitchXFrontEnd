import { HttpErrorResponse } from "@angular/common/http";
import { DropDownItem } from "../contracts/dropdown-item";
import { OrderHistoryItemResponseDto } from "../Dtos/responses/orderResponseDto";
import { ERole } from "../enums/enums";
import { ProblemDetails } from "../models/error-response";

export function dateFilterValues() : DropDownItem[] {
    return [
        { id: 1, value: 'This Week' },
        { id: 2, value: 'This Month' },
        { id: 3, value: 'Last Month' },
        { id: 4, value: 'This Year' },
        { id: 5, value: 'Last Year' },
        { id: 6, value: 'Custom Range' },
        { id: 7, value: 'All Time' }
    ];
}

export function userStatusesFilterValues(): DropDownItem[] {
    return [
        { id: 1, value: 'Active' },
        { id: 0, value: 'Inactive' }
    ];
}

export function userRolesFilterValue(): DropDownItem[] {
    const roleList = Object.keys(ERole)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
        id: ERole[key as keyof typeof ERole],
        value: key
    }));
    
    return roleList;
}


// *********************Dummy Data Generation*********************
export function generateDummyOrders() : OrderHistoryItemResponseDto[] {
    const dummyOrders: OrderHistoryItemResponseDto[] = [
    ];
    return dummyOrders;
}


export function normalizeError(error: unknown): {
  message: string;
  status?: number;
  details?: ProblemDetails;
} {
  debugger
  // Handle ProblemDetails
  if (typeof error === 'object' && error !== null && 'title' in error) {
    const pd = error as ProblemDetails;
    return {
      message: pd.detail || pd.title || 'An error occurred',
      status: pd.status,
      details: pd
    };
  }
  
  // Handle HttpErrorResponse
  if (error instanceof HttpErrorResponse) {
    return {
      message: error.error?.message || error.message || 'HTTP request failed',
      status: error.status,
      details: error.error
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  // Fallback for unknown error types
  return { message: 'An unknown error occurred' };
}