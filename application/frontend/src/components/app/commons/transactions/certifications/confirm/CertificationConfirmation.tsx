import React from "react";
import {utils} from "ethers";
import {ConfirmationCertificationPresentable} from "@unece/cotton-fetch";

type Props = {
    component: any
    certification: ConfirmationCertificationPresentable | undefined
};

export type CertificationConfirmationChildProps = {
    blockchainVerification: () => void

    // getter of state
    documentBlockchainVerified: boolean

    // getter of props
    certification: ConfirmationCertificationPresentable | undefined
}

export const CertificationConfirmation = (props: Props) => {
    const Component = props.component;
    const [documentBlockchainVerified, setDocumentBlockchainVerified] = React.useState<boolean>(false);

    const blockchainVerification = async () => {
        if (props.certification?.document?.content) {
            const document_hash = utils.hashMessage(props.certification.document?.content)
            // const document_timestamp = await props?.uneceCottonTracking?.getDocumentTimestamp(document_hash);
            // console.log('document_timestamp', document_timestamp?.toNumber());
            // TODO re-enable blockchain
            // if (document_timestamp?.toNumber() > 0) {
            //     setDocumentBlockchainVerified(true);
            // } else {
            //     setDocumentBlockchainVerified(false);
            // }
            setDocumentBlockchainVerified(true);
        }
    };

    return (
        <Component
            blockchainVerification={blockchainVerification}

            // getter of state
            documentBlockchainVerified={documentBlockchainVerified}

            // getter of props
            certification={props.certification}
        />
    );
}
