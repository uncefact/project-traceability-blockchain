import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {ConfirmationCertificationPresentable} from "@unece/cotton-fetch";
import {CertificationConfirmation} from "./CertificationConfirmation";
import {act} from "react-dom/test-utils";

Enzyme.configure({ adapter: new Adapter() });

describe('Certification Confirmation test', () => {
    
    const certification: ConfirmationCertificationPresentable = {
        certificateReferenceNumber: "1234",
        document: {
            content: "content pdf",
            fileName: "test_file.pdf",
            contentType: "application/pdf"
        },
        productCategories: ['prodCategory1'],
        processTypes: ['procType1']
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Render without crashing', async () => {
        const Component = jest.fn().mockImplementation(() => <div>Component</div>);

        mount(<CertificationConfirmation
                component={Component}
                certification={certification}/>
        );
    });

    it('Render without crashing async', async () => {
        const Component = jest.fn().mockImplementation(() => <div>Component</div>);
        await act(async () => {
            await mount(<CertificationConfirmation
                component={Component}
                certification={certification}/>
            );
        });
    });

    it('blockchainVerification test', async () => {
        const Component = jest.fn().mockImplementation(() => <div>Component</div>);
        await act(async () => {
            await mount(<CertificationConfirmation
                component={Component}
                certification={certification}/>
            );
        });

        expect(Component).toHaveBeenCalledTimes(1);
        expect(Component.mock.calls[0][0].documentBlockchainVerified).toEqual(false);
        await act(async () => {
            Component.mock.calls[0][0].blockchainVerification();
        });
        // there is the content of the document
        expect(Component.mock.calls[1][0].documentBlockchainVerified).toEqual(true);


        // the document has no content
        // @ts-ignore
        certification.document.content = undefined;
        await act(async () => {
            await mount(<CertificationConfirmation
                component={Component}
                certification={certification}/>
            );
        });

        // there is the content of the document
        expect(Component.mock.calls[2][0].documentBlockchainVerified).toEqual(false);
        await act(async () => {
            Component.mock.calls[2][0].blockchainVerification();
        });
        // no changes have been made so the "latest" component is the same as before
        expect(Component.mock.calls[2][0].documentBlockchainVerified).toEqual(false);
    });

});