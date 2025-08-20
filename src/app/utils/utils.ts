import { HttpErrorResponse } from "@angular/common/http";
import { DropDownItem } from "../contracts/dropdown-item";
import { OrderHistoryItemResponseDto } from "../Dtos/responses/orderResponseDto";
import { EOrderStatus, ERole } from "../enums/enums";
import { User } from "../Dtos/requests/request-dto";

export function dateFilterValues() : DropDownItem[] {
  return [
    { id: 1, value: 'Today' },
    { id: 2, value: 'This Week' },
    { id: 3, value: 'Last Week' },
    { id: 4, value: 'This Month' },
    { id: 5, value: 'Last Month' },
    { id: 6, value: 'This Year' },
    { id: 7, value: 'Last Year' },
    { id: 8, value: 'Custom Range' },
    { id: 9, value: 'All Time' }
  ];
}

export function userStatusesFilterValues(): DropDownItem[] {
  return [
    { id: 1, value: 'Active' },
    { id: 0, value: 'Inactive' },
    { id: 2, value: 'Deleted' },
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

export function orderStatusFilterValue(): DropDownItem[] {
  const statusList = Object.keys(EOrderStatus)
  .filter(key => isNaN(Number(key)))
  .map(key => ({
    id: EOrderStatus[key as keyof typeof EOrderStatus],
    value: key
  }));
  
  return statusList;
}


export function validateCurrentRole(roles?: string[]): ERole {
  let role: ERole = ERole.CUSTOMER;
  if(roles && roles.length > 0) {
    if(roles.includes(ERoleToString[ERole.CUSTOMER])) {
      role = ERole.CUSTOMER;
    }
    if(roles.includes(ERoleToString[ERole.CUTTER])) {
      role = ERole.CUTTER;
    }
    if(roles.includes(ERoleToString[ERole.TAILOR])) {
      role = ERole.TAILOR;
    }
    if(roles.includes(ERoleToString[ERole.SHOP_OWNER])) {
      role = ERole.SHOP_OWNER;
    }
    if(roles.includes(ERoleToString[ERole.SOFT_OWNER])) {
      role = ERole.SOFT_OWNER;
    }
  }
  return role;
}

export function valdiateRoles(userRolesItems: DropDownItem[], currentRole: ERole): DropDownItem[] {
  debugger
    userRolesItems = userRolesItems.filter(item => item.id !== currentRole);
    const index = userRolesItems.findIndex(item => item.id === ERole.SOFT_OWNER);
    if (index !== -1) {
      userRolesItems.splice(index, 1);
    }
    return userRolesItems;
}

export const ERoleToString = {
  [ERole.SOFT_OWNER]: 'SOFT_OWNER',
  [ERole.SHOP_OWNER]: 'SHOP_OWNER',
  [ERole.TAILOR]: 'TAILOR',
  [ERole.CUTTER]: 'CUTTER',
  [ERole.SWEEPER]: 'SWEEPER',
  [ERole.CUSTOMER]: 'CUSTOMER',
  [ERole.DEMO_USER]: 'DEMO_USER'
} as const;



export interface NormalizedError {
  message: string;
  status?: number;
  details: string;
  errorType: 'API_ERROR' | 'VALIDATION_ERROR' | 'HTTP_ERROR' | 'CLIENT_ERROR' | 'UNKNOWN_ERROR';
  errors?: Array<{ code: string; description: string }>; // For validation errors
}

export function normalizeError(error: unknown): NormalizedError {
  // Handle API response format (your specific case)
  if (isApiErrorResponse(error)) {
    return {
      message: error.message || 'API Error',
      status: error.statusCode,
      details: error.data?.map(e => e.description).join(' ') || error.message,
      errorType: 'VALIDATION_ERROR',
      errors: error.data
    };
  }
  
  // Handle ProblemDetails
  if (isProblemDetails(error)) {
    return {
      message: error.title || 'Error',
      status: error.status,
      details: error.detail || "Error occurred.",
      errorType: 'API_ERROR'
    };
  }
  
  // Handle HttpErrorResponse
  if (error instanceof HttpErrorResponse) {
    // Check if it's your API error format
    if (isApiErrorResponse(error.error)) {
      return normalizeError(error.error);
    }
    
    return {
      message: error.message || 'HTTP Error',
      status: error.status,
      details: error.error,
      errorType: 'HTTP_ERROR'
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      errorType: 'CLIENT_ERROR',
      details: 'CLIENT_ERROR'
    };
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      errorType: 'CLIENT_ERROR',
      details: 'CLIENT_ERROR'
    };
  }
  
  // Fallback for unknown error types
  return {
    message: 'An unknown error occurred',
    errorType: 'UNKNOWN_ERROR',
    details: 'CLIENT_ERROR'
  };
}

// Type guards
function isApiErrorResponse(obj: any): obj is { data: Array<{ code: string; description: string }>, message: string, statusCode: number } {
  return obj && 
  Array.isArray(obj.data) && 
  obj.data.every((item: any) => 'code' in item && 'description' in item) &&
  'statusCode' in obj;
}

function isProblemDetails(obj: any): obj is { title: string; status?: number; detail?: string } {
  return obj && typeof obj === 'object' && 'title' in obj;
}