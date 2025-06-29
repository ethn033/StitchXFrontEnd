import { DropDownItem } from "../contracts/dropdown-item";

export function dateFilterValues() : DropDownItem[] {
    return [
        { id: '1', value: 'This Week' },
        { id: '3', value: 'This Month' },
        { id: '4', value: 'Last Month' },
        { id: '5', value: 'This Year' },
        { id: '6', value: 'Last Year' },
        { id: '7', value: 'Custom Range' },
        { id: '8', value: 'All Time' }
    ];
}