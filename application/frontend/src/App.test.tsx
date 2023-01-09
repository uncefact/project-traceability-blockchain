import React from 'react';
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import APP, {App} from "./App";
import {deleteAccessToken, getAccessToken, saveAccessToken} from "./api/utils";
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import InfoControllerApi from './api/InfoControllerApi';
import {JwtToken, User} from "@unece/cotton-fetch";
import {act} from "react-dom/test-utils";
import LoadingPage from "./components/app/commons/LoadingPage/LoadingPage";
import {useLocation} from "react-router-dom";
import Routes from "./routes/Routes";

Enzyme.configure({ adapter: new Adapter() });

jest.mock('./routes/Routes', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(()=><div>Routes</div>),
  pathChangeListener: jest.fn().mockReturnValue(false)
}));
jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(),
    useLocation: jest.fn()
  }
});
jest.mock('./api/utils', () => {
  return {
    deleteAccessToken: jest.fn(),
    getAccessToken: jest.fn(),
    saveAccessToken: jest.fn(),
  }
});
jest.mock('./api/InfoControllerApi', () => {
  return {
    getInfo: jest.fn(),
    login: jest.fn(),
  }
});
jest.mock('./components/StructureComponents/Header/Header', () => {
  return jest.fn().mockImplementation(({children}) => <div className={'Header'}>{children}</div>);
});
jest.mock('./components/app/commons/LoadingPage/LoadingPage', () => {
  return jest.fn().mockImplementation(({children}) => <div className={'LoadingPage'}>{children}</div>)
});
jest.mock("./components/GenericComponents/MessagesBar/MessagesBar", () => {
  return jest.fn().mockImplementation(({children}) => <div className={'MessageBar'}>{children}</div>);
});
jest.mock("./components/StructureComponents/Sidebar/Sidebar", () => {
  return jest.fn().mockImplementation(({children}) => <div className={'Sidebar'}>{children}</div>);
});

const mockStore = configureMockStore([thunk]);
let store = mockStore({});

describe('App test', () => {
  const MockedRoutes = mocked(Routes, true);
  const MockedSaveAccessToken = mocked(saveAccessToken, true);
  const MockedDeleteAccessToken = mocked(deleteAccessToken, true);
  const MockedGetAccessToken = mocked(getAccessToken, true);
  const MockedInfoControllerApi = mocked(InfoControllerApi, true);
  const MockedLoadingPage = mocked(LoadingPage, true);
  const MockedUseLocation = mocked(useLocation, true);

  const setUserLoggedIn = jest.fn();
  const removeUserLoggedIn = jest.fn();
  const addSuccessMessage = jest.fn();
  const addErrorMessage = jest.fn();
  const startLoading = jest.fn();
  const stopLoading = jest.fn();
  const setCompanyIndustrialSector = jest.fn();
  const removeCompanyIndustrialSector = jest.fn();

  // @ts-ignore
  MockedUseLocation.mockReturnValue({
    state: { from: { pathname: "/previous_path" } },
    pathname: "/actual_path"
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  })
  it('Render without crashing', () => {
    mount(
        <Provider store={store}>
          <APP />
        </Provider>
    );

    mount(<App
      setUserLoggedIn={setUserLoggedIn}
      removeUserLoggedIn={removeUserLoggedIn}
      addSuccessMessage={addSuccessMessage}
      addErrorMessage={addErrorMessage}
      startLoading={startLoading}
      stopLoading={stopLoading}
      setCompanyIndustrialSector={setCompanyIndustrialSector}
      removeCompanyIndustrialSector={removeCompanyIndustrialSector}
    />);
  });
  it('Content test', () => {
    mount(<App
        setUserLoggedIn={setUserLoggedIn}
        removeUserLoggedIn={removeUserLoggedIn}
        addSuccessMessage={addSuccessMessage}
        addErrorMessage={addErrorMessage}
        startLoading={startLoading}
        stopLoading={stopLoading}
        setCompanyIndustrialSector={setCompanyIndustrialSector}
        removeCompanyIndustrialSector={removeCompanyIndustrialSector}
    />);
    expect(MockedLoadingPage).toHaveBeenCalledTimes(2);
  });
  it('loadUserInfo test - access token found - getInfo ok', async () => {
    MockedGetAccessToken.mockReturnValue('accessTokenTest');
    const user = {
      firstname: 'firstnameTest',
      company: {
        companyIndustry: {
          name: 'cotton'
        }
      }
    };
    MockedInfoControllerApi.getInfo.mockReturnValue(new Promise<User>((resolve => resolve(user))));
    await act(async () => {
      await mount(<App
          setUserLoggedIn={setUserLoggedIn}
          removeUserLoggedIn={removeUserLoggedIn}
          addSuccessMessage={addSuccessMessage}
          addErrorMessage={addErrorMessage}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setCompanyIndustrialSector={setCompanyIndustrialSector}
          removeCompanyIndustrialSector={removeCompanyIndustrialSector}
      />);
    });
    expect(setUserLoggedIn).toHaveBeenCalledTimes(1);
    expect(setUserLoggedIn).toHaveBeenNthCalledWith(1, user);
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: true,
      handleLogin: expect.any(Function),
      handleLogout: expect.any(Function)
    }, {});
  });
  it('loadUserInfo test - access token found - getInfo fail', async () => {
    MockedGetAccessToken.mockReturnValue('accessTokenTest');
    MockedInfoControllerApi.getInfo.mockReturnValue(new Promise<User>(((resolve, reject) => reject())))
    await act(async () => {
      await mount(<App
          setUserLoggedIn={setUserLoggedIn}
          removeUserLoggedIn={removeUserLoggedIn}
          addSuccessMessage={addSuccessMessage}
          addErrorMessage={addErrorMessage}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setCompanyIndustrialSector={setCompanyIndustrialSector}
          removeCompanyIndustrialSector={removeCompanyIndustrialSector}
      />);
    });
    expect(setUserLoggedIn).not.toHaveBeenCalled();
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: false,
      handleLogin: expect.anything(),
      handleLogout: expect.anything(),
    }, {});
  });
  it('loadUserInfo test - access token not found', async () => {
    MockedGetAccessToken.mockReturnValue(null);
    await act(async () => {
      await mount(<App
          setUserLoggedIn={setUserLoggedIn}
          removeUserLoggedIn={removeUserLoggedIn}
          addSuccessMessage={addSuccessMessage}
          addErrorMessage={addErrorMessage}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setCompanyIndustrialSector={setCompanyIndustrialSector}
          removeCompanyIndustrialSector={removeCompanyIndustrialSector}
      />);
    });
    expect(MockedDeleteAccessToken).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: false,
      handleLogin: expect.anything(),
      handleLogout: expect.anything(),
    }, {});
    expect(removeUserLoggedIn).toHaveBeenCalledTimes(1);
  });
  it('handleLogin test - login ok', async () => {
    MockedGetAccessToken.mockReturnValue(null);
    await act(async () => {
      await mount(<App
          setUserLoggedIn={setUserLoggedIn}
          removeUserLoggedIn={removeUserLoggedIn}
          addSuccessMessage={addSuccessMessage}
          addErrorMessage={addErrorMessage}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setCompanyIndustrialSector={setCompanyIndustrialSector}
          removeCompanyIndustrialSector={removeCompanyIndustrialSector}
      />);
    });
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: false,
      handleLogin: expect.anything(),
      handleLogout: expect.anything(),
    }, {});

    const user = {
      firstname: 'firstnameTest',
      company: {
        companyIndustry: {
          name: 'cotton'
        }
      }
    };
    const loginRequest = {
      username: 'usernameTest',
      password: 'passwordTest',
    }
    const token = {
      token: 'tokenTest'
    }
    MockedGetAccessToken.mockReturnValue('accessTokenTest');
    MockedInfoControllerApi.getInfo.mockReturnValue(new Promise<User>((resolve => resolve(user))));
    MockedInfoControllerApi.login.mockReturnValue(new Promise<JwtToken>((resolve => resolve(token))));
    await act(async () => {
      await MockedRoutes.mock.calls[0][0].handleLogin(loginRequest);
    });
    expect(MockedSaveAccessToken).toHaveBeenCalledTimes(1);
    expect(MockedSaveAccessToken).toHaveBeenNthCalledWith(1, token.token);
    expect(setCompanyIndustrialSector).toHaveBeenCalledTimes(1);
    expect(setCompanyIndustrialSector).toHaveBeenNthCalledWith(1, user.company.companyIndustry.name);
    expect(MockedRoutes).toHaveBeenCalledTimes(3);
    expect(MockedRoutes).toHaveBeenNthCalledWith(2, {
      authenticated: true,
      handleLogin: expect.any(Function),
      handleLogout: expect.any(Function)
    }, {});

  });
  it('handleLogin test - login fail', async () => {
    MockedGetAccessToken.mockReturnValue(null);
    await act(async () => {
      await mount(<App
          setUserLoggedIn={setUserLoggedIn}
          removeUserLoggedIn={removeUserLoggedIn}
          addSuccessMessage={addSuccessMessage}
          addErrorMessage={addErrorMessage}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setCompanyIndustrialSector={setCompanyIndustrialSector}
          removeCompanyIndustrialSector={removeCompanyIndustrialSector}
      />);
    });
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: false,
      handleLogin: expect.anything(),
      handleLogout: expect.anything(),
    }, {});
    const loginRequest = {
      username: 'usernameTest',
      password: 'passwordTest',
    }
    MockedInfoControllerApi.login.mockReturnValue(new Promise<JwtToken>(((resolve, reject) => reject())))
    await act(async () => {
      await MockedRoutes.mock.calls[0][0].handleLogin(loginRequest);
    });
    expect(MockedSaveAccessToken).not.toHaveBeenCalled();
    expect(MockedDeleteAccessToken).toHaveBeenCalledTimes(2);
    expect(addErrorMessage).toHaveBeenCalledTimes(1);
    expect(addErrorMessage).toHaveBeenNthCalledWith(1, "Invalid username or password!");
    expect(MockedRoutes).toHaveBeenCalledTimes(1);
    expect(MockedRoutes).toHaveBeenNthCalledWith(1, {
      authenticated: false,
      handleLogin: expect.anything(),
      handleLogout: expect.anything(),
    }, {});
    expect(removeUserLoggedIn).toHaveBeenCalledTimes(2);

    // server not available
    MockedInfoControllerApi.login.mockReturnValue(new Promise<JwtToken>(((resolve, reject) => reject("Failed to fetch the request"))))
    await act(async () => {
      await MockedRoutes.mock.calls[0][0].handleLogin(loginRequest);
    });
    expect(addErrorMessage).toHaveBeenCalledTimes(2);
    expect(addErrorMessage).toHaveBeenNthCalledWith(2, "Server not available!");
  });
});
