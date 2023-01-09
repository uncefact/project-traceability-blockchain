import React from "react";
import {Form} from "react-bootstrap";
import {getBase64} from "../../../../../../../utils/basicUtils";
import {useTranslation} from "react-i18next";
import {InputSwitch} from "../../../../../../GenericComponents/InputSwitch/InputSwitch";

type Props = {
    register: any,
    fileUploaded: any,
    setFileUploaded: any,
}

export const CertificationAttachment = (props: Props) => {
    const { t } = useTranslation();

    const handleDocumentUpload = async (file: File) => {
        getBase64(file).then(contentFile => {
            // @ts-ignore
            props.setFileUploaded({name: file.name, contentType: file.type, content: contentFile});
        });
    };

    return (
        <>
            <InputSwitch
                Option1={<Form.File
                    type="file"
                    name="documentUpload"
                    label={props.fileUploaded.name}
                    /*@ts-ignore*/
                    onChange={(e) => handleDocumentUpload(e.target.files[0])}
                    custom
                    ref={props.register({required: false})}
                />
                }
                option1Hint={t("certification.switch_to_link")}
                uploadLimit1={t("max_upload")}
                option1EmptyValue={() => props.setFileUploaded({name: t("upload_document")})}
                Option2={<Form.Control
                    name="certificatePageUrl"
                    ref={props.register({required: false})}
                    type="text"
                    placeholder={t("placeholders.certification.document_url")}/>
                }
                option2Hint={t("certification.switch_to_document")}
            />

        </>

    );
}