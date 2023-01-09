import {RootState} from "./index";

export const selectUserLoggedIn = (state: RootState) => state.userLoggedIn;

export const selectCompanyIndustrialSector = (state: RootState) => state.companyIndustrialSector;

export const selectMessages = (state: RootState) => state.messages;

export const selectLoading = (state: RootState) => state.loading;
