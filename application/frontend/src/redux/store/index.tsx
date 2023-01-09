import {combineReducers} from 'redux';
import {userLoggedInReducer} from "./UserLoggedIn/reducers";
import {messagesReducer} from "./Messages/reducers";
import {loadingReducer} from "./Loading/reducers";
import {companyIndustrialSectorReducer} from "./CompanyIndustrialSector/reducers";

export const rootReducer = combineReducers({
    userLoggedIn: userLoggedInReducer,
    companyIndustrialSector: companyIndustrialSectorReducer,
    messages: messagesReducer,
    loading: loadingReducer
});

export type RootState = ReturnType<typeof rootReducer>
