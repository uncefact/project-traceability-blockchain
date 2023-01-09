import React from 'react';
import {RootState} from "../../../../redux/store";
import {selectUserLoggedIn} from "../../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import styles from './HomePage.module.scss';
import TradeTable from "./tables/TradeTable/TradeTable";
import CompanyControllerApi from '../../../../api/CompanyControllerApi';
import {ethers, Wallet} from "ethers";
import {addErrorMessage, addSuccessMessage} from "../../../../redux/store/Messages/actions";
import TransformationPlanTable from "./tables/TransformationPlanTable/TransformationPlanTable";
import CertificationTable from "./tables/CertificationTable/CertificationTable";
import {Nav} from "react-bootstrap";
import {useMediaQuery} from "react-responsive";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
    }
);

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    //HomePage props
};

export const HomePage = (props: Props) => {

    const [wallet, setWallet] = React.useState<Wallet | undefined>(undefined);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [tabSelected, setTabSelected] = React.useState<string>();
    const { t } = useTranslation();

    const tabs = {
        traceabilityEvents: { eventKey: 'traceabilityEvents', displayName: t("traceability") },
        materials: { eventKey: 'materials', displayName: t("materials") },
        certificates: { eventKey: 'certificates', displayName: t("certificates") },
    };

    React.useEffect(() => {
        loadInitialState();
        // eslint-disable-next-line
    }, []);

    // React.useEffect(() => {
    //     getSupplyChains();
    // });

    const getSupplyChains = async () => {
        //@TODO Blockchain unused part
        //try {
        //     console.log("Walleeeeet",wallet)
        //     if (wallet) {
        //         const resp = await SupplyChainInfoControllerApi.getSupplyChainsForConsignee();
        //         console.log("Chains",resp)
        //         // const myPubKey = wallet._signingKey().publicKey;
        //         // for (const [consigneeEthAddress, materialMap] of Object.entries(resp)) {
        //         //     const pubKey = await CompanyControllerApi.getPublicKeyByEthAddress({
        //         //         ethAddress: consigneeEthAddress
        //         //     });
        //         //
        //         //     const encryptedForConsignee = await EthCrypto.encryptWithPublicKey(
        //         //         pubKey, // publicKey
        //         //         JSON.stringify(materialMap) // message
        //         //     );
        //         //
        //         //     const encryptedForMe = await EthCrypto.encryptWithPublicKey(
        //         //         myPubKey,
        //         //         JSON.stringify(materialMap) // message
        //         //     );
        //         //
        //         //     if (props.uneceCottonTracking) {
        //         //         // let transaction = await props.uneceCottonTracking.storeConsigneeInfo(consigneeEthAddress, JSON.stringify(encryptedForConsignee))
        //         //         // let result = await transaction.wait();
        //         //         // result.events?.forEach(value => value.event ? props.addSuccessMessage(value.event) : null);
        //         //         // transaction = await props.uneceCottonTracking.storePrivateCompanyInfo(JSON.stringify(encryptedForMe));
        //         //         // result = await transaction.wait();
        //         //         // result.events?.forEach(value => value.event ? props.addSuccessMessage(value.event) : null);
        //         //     }
        //         // }
        //     }
        // } catch (error) {
        //     console.log("error: ", error);
        //     props.addErrorMessage(`${t("popups.errors.supply_chain")}: ${error}`);
        // }
    }

    const loadInitialState = async () => {
        let privateKey, publicKey;

        if (props.userLoggedIn?.company?.partnerType?.name === 'certifier')
            setTabSelected(tabs.certificates.eventKey);
        else
            setTabSelected(tabs.traceabilityEvents.eventKey);

        // try {
        //     const resp = await CompanyControllerApi.getFacilityCustodialWalletCredentials();
        //     privateKey = resp.privateKey;
        //     publicKey = resp.publicKey;
        // } catch (e) {
        //     console.error('Wallet not found');
        // }
        // const provider = initializeInfuraProvider('kovan', 'bc984347e77d4a64bcb4b549b0a73849');
        // let initializedWallet;
        // if(privateKey && publicKey) {
        //     initializedWallet = initializeWallet(privateKey, provider);
        //     console.info('Wallet loaded correctly');
        // }
        // else {
        //     initializedWallet = createWallet(provider);
        //     try {
        //         await CompanyControllerApi.putFacilityCustodialWalletCredentials({
        //             custodialWalletCredentialsRequest: {
        //                 privateKey: initializedWallet._signingKey().privateKey,
        //                 publicKey: initializedWallet._signingKey().publicKey
        //             }
        //         });
        //         console.info('New wallet created and saved')
        //     } catch (e) {
        //         console.error('Wallet creation error');
        //         props.addErrorMessage(e);
        //     }
        // }
        // setWallet(initializedWallet);
    }

    const initializeInfuraProvider = (network: string, apiKey: string): ethers.providers.InfuraProvider => {
        return new ethers.providers.InfuraProvider(network, apiKey);
    };

    const createWallet = (provider: ethers.providers.InfuraProvider): Wallet => {
        return Wallet.createRandom().connect(provider);
    };

    const initializeWallet = (privateKey: string, provider: ethers.providers.InfuraProvider): Wallet => {
        return new Wallet(privateKey, provider);
    };

    const onSelect = (eventKey: any) => {
        setTabSelected(eventKey);
    }
    if(isTabletOrMobile) {
        const tables = props.userLoggedIn?.company?.partnerType?.name === 'certifier' ? Object.entries(tabs).filter(([key, value]) => key==='certificates') : Object.entries(tabs);
        return (
            <div>
                { tables.length > 1 &&
                    <Nav justify variant="tabs" defaultActiveKey={props.userLoggedIn?.company?.partnerType?.name !== 'certifier' ? tabs.traceabilityEvents.eventKey : tabs.certificates.eventKey}>
                        {
                            tables.map(([key, value]) =>
                                <Nav.Item key={key}>
                                    <Nav.Link eventKey={value.eventKey} onSelect={onSelect}>{value.displayName}</Nav.Link>
                                </Nav.Item>)
                        }
                    </Nav>
                }
                <div className={`${styles.Row} mb-4`}>
                    {
                        tabSelected===tabs.traceabilityEvents.eventKey ? <TradeTable /> : tabSelected===tabs.materials.eventKey ? <TransformationPlanTable /> : <CertificationTable />
                    }
                </div>
            </div>
        );
    }
    return (
        <div>
            { props.userLoggedIn?.company?.partnerType?.name !== 'certifier' &&
                <>
                    <div className={`${styles.Row} mb-4`}>
                        <TradeTable/>
                    </div>
                    <div className={`${styles.Row} mb-4`}>
                        <TransformationPlanTable />
                    </div>
                </>
            }
            <div className={`${styles.Row} mb-4`}>
                <CertificationTable />
            </div>
        </div>
    );
};

export default connector(HomePage);
