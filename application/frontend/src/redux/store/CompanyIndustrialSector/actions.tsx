import {
    CompanyIndustrialSectorActionTypes,
    REMOVE_COMPANY_INDUSTRIAL_SECTOR,
    SET_COMPANY_INDUSTRIAL_SECTOR
} from "./actionTypes";

export function setCompanyIndustrialSector(sector: string | null): CompanyIndustrialSectorActionTypes {
    return {
        type: SET_COMPANY_INDUSTRIAL_SECTOR,
        payload: sector
    }
}

export function removeCompanyIndustrialSector(): CompanyIndustrialSectorActionTypes {
    return {
        type: REMOVE_COMPANY_INDUSTRIAL_SECTOR
    }
}
