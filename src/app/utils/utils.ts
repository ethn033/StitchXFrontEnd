import { DropDownItem } from "../contracts/dropdown-item";
import { OrderHistoryItemResponseDto } from "../Dtos/responses/orderResponseDto";
import { ERole } from "../enums/enums";

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