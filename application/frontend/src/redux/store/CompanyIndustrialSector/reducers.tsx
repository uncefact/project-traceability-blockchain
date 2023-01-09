import {
    CompanyIndustrialSectorActionTypes,
    REMOVE_COMPANY_INDUSTRIAL_SECTOR,
    SET_COMPANY_INDUSTRIAL_SECTOR
} from "./actionTypes";

const initialState: string | null = null;

export function companyIndustrialSectorReducer (
    state = initialState,
    action: CompanyIndustrialSectorActionTypes
): string | null {
    switch(action.type) {
        case SET_COMPANY_INDUSTRIAL_SECTOR:
            return action.payload
        case REMOVE_COMPANY_INDUSTRIAL_SECTOR:
            return null
        default:
            return state
    }
}
