import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import HP, {HomePage} from "./HomePage";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import CompanyControllerApi from '../../../../api/CompanyControllerApi';
import {mocked} from "ts-jest/utils";
import {act} from "react-dom/test-utils";
import {ethers, Wallet} from "ethers";
import {User} from "@unece/cotton-fetch";
import {useMediaQuery} from "react-responsive";
import {Nav} from "react-bootstrap";


const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

// jest.mock('../../../../contracts', () => {
//     const UneceCottonTrackingFactory = {
//         connect: jest.fn().mockReturnValue("contract")
//     }
//     return {
//         UneceCottonTrackingFactory
//     }
// });

jest.mock('../../../../api/SupplyChainInfoControllerApi', () => {
    return {
        getSupplyChainsForConsignee: jest.fn()
    }
})

jest.mock('react-router-dom', () => {
    return {
        Link: jest.fn().mockImplementation(({children}) => <div className={'Link'}>{children}</div>)
    }
});
jest.mock('./tables/TradeTable/TradeTable', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'TradeTable'}>{children}</div>)
});
jest.mock('./tables/InputMaterialTable/InputMaterialTable', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'InputMaterialTable'}>{children}</div>)
});
jest.mock('./tables/TransformationPlanTable/TransformationPlanTable', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'TransformationPlanTable'}>{children}</div>)
});
jest.mock('./tables/CertificationTable/CertificationTable', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'CertificationTable'}>{children}</div>)
});
jest.mock('react-responsive', () => {
    return {
        useMediaQuery: jest.fn()
    }
});
jest.mock('ethers', () => {
    let Wallet = jest.fn();
    // @ts-ignore
    Wallet.createRandom = jest.fn();
    return {
        ethers: {
            providers: {
                InfuraProvider: jest.fn()
            }
        },
        Wallet
    }
});

jest.mock('../../../../api/CompanyControllerApi', () => {
    return {
        getFacilityCustodialWalletCredentials: jest.fn(),
        putFacilityCustodialWalletCredentials: jest.fn(),
    }
});
jest.mock('react-bootstrap', () => {
    let Nav = jest.fn().mockImplementation(({children}) => <div className={'Nav'}>{children}</div>);
    // @ts-ignore
    Nav.Item = jest.fn().mockImplementation(({children}) => <div className={'NavItem'}>{children}</div>);
    // @ts-ignore
    Nav.Link = jest.fn().mockImplementation(({children}) => <div className={'NavLink'}>{children}</div>);

    return {
        Nav
    };
});

Enzyme.configure({adapter: new Adapter()});


describe('HomePage test', () => {
    const MockedGetFacilityCustodialWalletCredentials = mocked(CompanyControllerApi.getFacilityCustodialWalletCredentials, true);
    const MockedPutFacilityCustodialWalletCredentials = mocked(CompanyControllerApi.putFacilityCustodialWalletCredentials, true);
    const MockedInfuraProvider = mocked(ethers.providers.InfuraProvider, true);
    const MockedWallet = mocked(Wallet, true);
    const MockedCreateRandomWallet = mocked(Wallet.createRandom, true);
    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const mockedUseMediaQuery = mocked(useMediaQuery);
    const MockedNavLink = mocked(Nav.Link, true);


    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.resolve({
            privateKey: 'privateKeyTest',
            publicKey: 'publicKeyTest'
        }));

        mount(
            <Provider store={store}>
                <HP/>
            </Provider>
        );


        const userLoggedIn: User = {
            firstname: 'test'
        };
        await act(async () => {
            await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
                                  addErrorMessage={addErrorMessage}


            />);
        });

    });
    it('Mobile content test', async () => {
        mockedUseMediaQuery.mockReturnValue(true);
        MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.resolve({
            privateKey: 'privateKeyTest',
            publicKey: 'publicKeyTest'
        }));
        const userLoggedIn: User = {
            firstname: 'test',
            company: {
                partnerType: {
                    name: 'trader'
                }
            }
        };
        let component: any = null;
        await act(async () => {
            component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
                                              addErrorMessage={addErrorMessage}

            />);
        });
        component.update();
        expect(MockedNavLink).toHaveBeenCalledTimes(6);
        // @ts-ignore
        expect(component.find('.TradeTable').length).toEqual(1);
        act(() => {// @ts-ignore
            MockedNavLink.mock.calls[3][0].onSelect('materials');
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.TransformationPlanTable').length).toEqual(1);
        act(() => {// @ts-ignore
            MockedNavLink.mock.calls[4][0].onSelect('certificates');
        });
        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.CertificationTable').length).toEqual(1);
    });

    it('Mobile content test - company certifier', async () => {
        mockedUseMediaQuery.mockReturnValue(true);
        MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.resolve({
            privateKey: 'privateKeyTest',
            publicKey: 'publicKeyTest'
        }));
        const userLoggedIn = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'Company test SRL',
                address1: 'Company address test',
                partnerType: {
                    name: 'certifier'
                }
            }
        };

        let component: any;
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();

        await act(async () => {
            component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
                                              addErrorMessage={addErrorMessage}



            />);
        });
        component.update();

        // there is only a certificate table, so there is no need to show the navbar
        expect(MockedNavLink).not.toHaveBeenCalled();
        // @ts-ignore
        expect(component.find('.CertificationTable').length).toEqual(1);

    });

    it('Desktop content test - company role', async () => {
        mockedUseMediaQuery.mockReturnValue(false);
        MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.resolve({
            privateKey: 'privateKeyTest',
            publicKey: 'publicKeyTest'
        }));
        const userLoggedIn: User = {
            firstname: 'firstnameTest',
            lastname: 'lastnameTest',
            company: {
                companyName: 'Company test SRL',
                address1: 'Company address test',
            }
        };

        let component: any;
        const addSuccessMessage = jest.fn();
        const addErrorMessage = jest.fn();

        // company with a "normal" role (the ones that trade together)
        await act(async () => {
            component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
                                              addErrorMessage={addErrorMessage}



            />);
        });
        component.update();
        expect(component.find(".TradeTable").length).toEqual(1);
        expect(component.find(".TransformationPlanTable").length).toEqual(1);
        expect(component.find(".CertificationTable").length).toEqual(1);

        // company with role "certifier"
        userLoggedIn.company = {companyName: 'Company test SRL', partnerType: {name: 'certifier'}};
        await act(async () => {
            component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
                                              addErrorMessage={addErrorMessage}



            />);
        });
        expect(component.find(".TradeTable").length).toEqual(0);
        expect(component.find(".TransformationPlanTable").length).toEqual(0);
        expect(component.find(".CertificationTable").length).toEqual(1);


    });

    // it('loadInitialState - company found, custodial wallet already present', async () => {
    //     const userLoggedIn = {
    //         firstname: 'firstnameTest',
    //         lastname: 'lastnameTest',
    //         company: {
    //             companyName: 'Company test SRL',
    //             address1: 'Company address test'
    //         }
    //     };
    //
    //     let component: any;
    //     const addSuccessMessage = jest.fn();
    //     const addErrorMessage = jest.fn();
    //     MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.resolve({
    //         privateKey: 'privateKeyTest',
    //         publicKey: 'publicKeyTest'
    //     }));
    //     // @ts-ignore
    //     MockedInfuraProvider.mockImplementation(() => {
    //         return {
    //             provider: 'providerTest'
    //         }
    //     });
    //     // @ts-ignore
    //     MockedWallet.mockImplementation(() => {
    //         return {
    //             address: 'walletAddressTest'
    //         }
    //     });
    //     await act(async () => {
    //         component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
    //                                           addErrorMessage={addErrorMessage}
    //
    //
    //
    //         />);
    //     });
    //     component.update();
    //     expect(MockedGetFacilityCustodialWalletCredentials).toHaveBeenCalledTimes(1);
    //     expect(MockedInfuraProvider).toHaveBeenCalledTimes(1);
    //     expect(MockedInfuraProvider).toHaveBeenNthCalledWith(1, 'kovan', 'bc984347e77d4a64bcb4b549b0a73849');
    //     expect(MockedWallet).toHaveBeenCalledTimes(1);
    //     expect(MockedWallet).toHaveBeenNthCalledWith(1, 'privateKeyTest', {provider: 'providerTest'});
    // });
    //
    // it('loadInitialState - company found, wallet not present', async () => {
    //     const userLoggedIn = {
    //         firstname: 'firstnameTest',
    //         lastname: 'lastnameTest',
    //         company: {
    //             companyName: 'Company test SRL',
    //             address1: 'Company address test'
    //         }
    //     };
    //     let component: any;
    //
    //     const addSuccessMessage = jest.fn();
    //     const addErrorMessage = jest.fn();
    //     MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.reject('NOT_FOUND'));
    //     // @ts-ignore
    //     MockedInfuraProvider.mockImplementation(() => {
    //         return {
    //             provider: 'providerTest'
    //         }
    //     });
    //     const MockedConnect = jest.fn().mockReturnValue({
    //         address: 'walletAddressTest',
    //         _signingKey: jest.fn().mockReturnValue({
    //             privateKey: 'privateKeyTest',
    //             publicKey: 'walletAddressTest'
    //         })
    //     });
    //     // @ts-ignore
    //     MockedCreateRandomWallet.mockReturnValue({
    //         connect: MockedConnect
    //     })
    //     await act(async () => {
    //         component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
    //                                           addErrorMessage={addErrorMessage}
    //
    //
    //         />);
    //     });
    //     component.update();
    //     //CompanyControllerApi.getFacilityCustodialWalletCredentials
    //     expect(MockedGetFacilityCustodialWalletCredentials).toHaveBeenCalledTimes(1);
    //     //initializeInfuraProvider
    //     expect(MockedInfuraProvider).toHaveBeenCalledTimes(1);
    //     expect(MockedInfuraProvider).toHaveBeenNthCalledWith(1, 'kovan', 'bc984347e77d4a64bcb4b549b0a73849');
    //     //createWallet
    //     expect(MockedConnect).toHaveBeenCalledTimes(1);
    //     expect(MockedConnect).toHaveBeenNthCalledWith(1, {provider: 'providerTest'});
    //     expect(MockedCreateRandomWallet).toHaveBeenCalledTimes(1)
    //     expect(MockedPutFacilityCustodialWalletCredentials).toHaveBeenCalledTimes(1);
    //     expect(MockedPutFacilityCustodialWalletCredentials).toHaveBeenNthCalledWith(1, {
    //         custodialWalletCredentialsRequest: {
    //             privateKey: 'privateKeyTest',
    //             publicKey: 'walletAddressTest'
    //         }
    //     });
    // });
    //
    // it('loadInitialState - company found, wallet not present - wallet creation error', async () => {
    //     const userLoggedIn = {
    //         firstname: 'firstnameTest',
    //         lastname: 'lastnameTest',
    //         company: {
    //             companyName: 'Company test SRL',
    //             address1: 'Company address test'
    //         }
    //     };
    //
    //     let component: any;
    //
    //     const addSuccessMessage = jest.fn();
    //     const addErrorMessage = jest.fn();
    //     MockedGetFacilityCustodialWalletCredentials.mockReturnValue(Promise.reject('NOT_FOUND'));
    //     MockedPutFacilityCustodialWalletCredentials.mockReturnValue(Promise.reject('NOT_FOUND'));
    //     // @ts-ignore
    //     MockedInfuraProvider.mockImplementation(() => {
    //         return {
    //             provider: 'providerTest'
    //         }
    //     });
    //     const MockedConnect = jest.fn().mockReturnValue({
    //         address: 'walletAddressTest',
    //         _signingKey: jest.fn().mockReturnValue({
    //             privateKey: 'privateKeyTest',
    //             publicKey: 'walletAddressTest'
    //         })
    //     });
    //     // @ts-ignore
    //     MockedCreateRandomWallet.mockReturnValue({
    //         connect: MockedConnect
    //     })
    //     await act(async () => {
    //         component = await mount(<HomePage userLoggedIn={userLoggedIn} addSuccessMessage={addSuccessMessage}
    //                                           addErrorMessage={addErrorMessage}
    //
    //
    //
    //         />);
    //     });
    //     component.update();
    //     //CompanyControllerApi.getFacilityCustodialWalletCredentials
    //     expect(MockedGetFacilityCustodialWalletCredentials).toHaveBeenCalledTimes(1);
    //     //initializeInfuraProvider
    //     expect(MockedInfuraProvider).toHaveBeenCalledTimes(1);
    //     expect(MockedInfuraProvider).toHaveBeenNthCalledWith(1, 'kovan', 'bc984347e77d4a64bcb4b549b0a73849');
    //     //createWallet
    //     expect(MockedConnect).toHaveBeenCalledTimes(1);
    //     expect(MockedConnect).toHaveBeenNthCalledWith(1, {provider: 'providerTest'});
    //     //CompanyControllerApi.putFacilityCustodialWalletCredentials
    //     expect(MockedPutFacilityCustodialWalletCredentials).toHaveBeenCalledTimes(1);
    //     expect(MockedPutFacilityCustodialWalletCredentials).toHaveBeenNthCalledWith(1, {
    //         custodialWalletCredentialsRequest: {
    //             privateKey: 'privateKeyTest',
    //             publicKey: 'walletAddressTest'
    //         }
    //     });
    // });

});
