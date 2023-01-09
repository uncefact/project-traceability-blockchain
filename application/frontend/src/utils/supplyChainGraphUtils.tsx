import {SustainabilityCriterionPresentable} from "@unece/cotton-fetch";
import Transformation from "../models/Transformation";
import CompanyInfo from "../models/CompanyInfo";
import Trade from "../models/Trade";
import Edge from "../models/Edge";
import Material from "../models/Material";
import SupplyChainInfo from "../models/SupplyChainInfo";


export const defaultNodeEdgeColor = "#7a7a7a";
export const validNodeEdgeColor = "#4edb34";
export const invalidNodeEdgeColor = "#e50000";
export const partialValidNodeEdgeColor = "#e5bf00";

export const getNodeColor = (sustainabilityCriterion: SustainabilityCriterionPresentable | null, transformation: Transformation | null, allTransformations: Transformation[]) => {
    // console.log(transformation?.name, allTransformations
    //     .flatMap(t => t.certificates))

    const arr = transformation?.processing_standards
        ?.filter(p => (sustainabilityCriterion?.processingStandardNames || []).includes(p))
        // ?.flatMap(p => transformation?.certificates?.filter(c => c?.processStandardName === p))
        // ?.map(certificate => {
        //     const nonValidMaterialCertificate = certificate?.subject === 'MATERIAL' &&
        //         allTransformations
        //             .filter(t => t.id !== transformation?.id)
        //             .flatMap(t => t.certificates)
        //             .filter(otherCert => otherCert.subject === 'SELF' && otherCert.status === 'ACCEPTED' && otherCert.id === certificate.id)
        //             .length === 0;
        //
        // return !(nonValidMaterialCertificate || certificate.status !== 'ACCEPTED')
        // })
        ?.flatMap((p, id) => {
            const certificates = transformation?.certificates?.filter(c => c.processStandardName === p &&
                (
                    c.processTypes && c.processTypes.length > 0
                        ? c.processTypes.some(x => transformation?.processesNames?.includes(x))
                        : true
                )
            ) || [];
            const cert = certificates.map(certificate => {
                const nonValidMaterialCertificate = certificate?.subject === 'MATERIAL' &&
                    allTransformations
                        .filter(t => t.id !== transformation?.id)
                        .flatMap(t => t.certificates)
                        .filter(otherCert => otherCert.subject === 'SELF' && otherCert.status === 'ACCEPTED' && otherCert.id === certificate.id)
                        .length === 0;
                return !(nonValidMaterialCertificate || certificate.status !== 'ACCEPTED')
            }) || [];
            return cert.length > 0 ? cert : [false]
        }) || [];
    if(arr.length == 0)
        return defaultNodeEdgeColor;
    if(arr.every(v => v))//All true
        return validNodeEdgeColor;
    if(arr.every(v => !v))//All false
        return invalidNodeEdgeColor;
    return partialValidNodeEdgeColor;//Some true and some false
}

export const getEdgeColor = (sustainabilityCriterion: SustainabilityCriterionPresentable | null, trades: Trade[]) => {
    const arr = trades.map(t => {
        return t?.processing_standards
            ?.filter(p => (sustainabilityCriterion?.processingStandardNames || []).includes(p))
            ?.map(p => !!t.certificates
                ?.find(c => c.processStandardName === p && c.status === 'ACCEPTED')) || [];
    });
    if(arr.every(a => a.length==0))
        return defaultNodeEdgeColor;
    if(arr.every(a => a.every(v => v)))//All true
        return validNodeEdgeColor;
    if(arr.every(a => a.every(v => !v)))//All false
        return invalidNodeEdgeColor;
    return partialValidNodeEdgeColor;//Some true and some false
}

export const getSustainabilityCriteriaCondition = (sc: SustainabilityCriterionPresentable | null) => {
    switch (sc?.name) {
        case 'Organic':
            return (x: number) => x % 2 === 0;
        case 'Chemical':
            return (x: number) => x % 3 === 0;
        case 'Recycled':
            return (x: number) => x < 4;
        case 'Quality':
            return (x: number) => x;
        case 'Social':
            return (x: number) => x === 5;
        default:
            return () => false
    }
}
export const getNodeLabel = (sc: SustainabilityCriterionPresentable | null) => {
    switch (sc?.name) {
        case 'Origin':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, f?.region, f?.country].filter(c => c && c!=='').join(', ');
        case 'Organic':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ');
        case 'Chemical':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ');
        case 'Recycled':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ')
        case 'Quality':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ');
        case 'Social':
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ');
        default:
            return (t: Transformation | null, f: CompanyInfo | null) => (t?.processesNames||[]).join(', ')+'\n'+[f?.visibleName, t?.name].filter(info => info && info!=='').join(', ')
    }
}

export const getTradesFromEdge = (supplyChain: SupplyChainInfo| null, edge: Edge | null) => {
    if(!edge || !supplyChain)
        return []
    const transformationFrom = supplyChain?.transformations?.find((t: any) => t.id === edge?.from) || null;
    const transformationTo = supplyChain?.transformations?.find((t: any) => t.id === edge?.to) || null;

    const outputMaterialFrom = supplyChain?.materials?.filter((m: Material) => m?.id === transformationFrom?.output_material_ids[0])?.[0] || null;
    const inputMaterialsTo = supplyChain?.materials?.filter((m: Material) => transformationTo?.input_material_ids?.includes(m?.id)) || null;

    return supplyChain?.trades?.filter((t: Trade) => Number([...t?.consignee_to_contractor_material_map?.values()][0]) === outputMaterialFrom?.id && inputMaterialsTo?.map(m => m.id).includes(Number([...t?.consignee_to_contractor_material_map?.keys()][0])));
}