export const SET_COMPANY_INDUSTRIAL_SECTOR = 'SET_COMPANY_INDUSTRIAL_SECTOR';
export const REMOVE_COMPANY_INDUSTRIAL_SECTOR = 'REMOVE_COMPANY_INDUSTRIAL_SECTOR';

interface SetCompanyIndustrialSectorAction {
    type: typeof SET_COMPANY_INDUSTRIAL_SECTOR,
    payload: string | null
}

interface RemoveCompanyIndustrialSectorAction {
    type: typeof REMOVE_COMPANY_INDUSTRIAL_SECTOR
}

export type CompanyIndustrialSectorActionTypes = SetCompanyIndustrialSectorAction | RemoveCompanyIndustrialSectorAction;