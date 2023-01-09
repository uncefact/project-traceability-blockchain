import Transformation from "../models/Transformation";
import Edge from "../models/Edge";
import Node from "../models/Node";
import SupplyChainInfo from "../models/SupplyChainInfo";
import Trade from "../models/Trade";
import CompanyInfo from "../models/CompanyInfo";

const findSourceTrades = (materialsIds: number[], supplyChainInfo: SupplyChainInfo) => {
    const sourceTrades = new Map<number, Trade>();
    for (const tr of supplyChainInfo.trades) {
        for (const mId of materialsIds) {
            if (tr.consignee_to_contractor_material_map.has(mId)) {
                sourceTrades.set(mId, tr);
            }
        }
    }
    return sourceTrades;
}

export const findTransformation = (materialId: number | undefined, supplyChainInfo: SupplyChainInfo) => {
    if (!materialId)
        return undefined;
    for (const t of supplyChainInfo.transformations) {
        if (t.output_material_ids.includes(materialId))
            return t;
    }
    return undefined;
}

const findCompany = (transformation: Transformation | undefined, supplyChainInfo: SupplyChainInfo) => {
    if (!transformation)
        return undefined;
    for (const c of supplyChainInfo.companiesInfo) {
        if (c.name == transformation.executor_company_id)
            return c;
    }
    return undefined;
}

export const expandTransformation = async (transformation: Transformation, to_node: Node, supplyChainInfo: SupplyChainInfo): Promise<{"nodes":Node[],"edges":Edge[]}> =>{
    const sourceTrades = findSourceTrades(transformation.input_material_ids, supplyChainInfo);
    let nodes : Node[] = [];
    let edges : Edge[] = [];
    for (const [mId, trade] of sourceTrades.entries()) {
        const sourceMaterialId = trade.consignee_to_contractor_material_map.get(mId);
        const sourceTransformation = findTransformation(sourceMaterialId, supplyChainInfo);
        if (!sourceTransformation) {
            console.log('We cannot determine the transformation that generated', sourceMaterialId);
            continue;
        }
        const companyInfo = findCompany(sourceTransformation, supplyChainInfo)
        if (!companyInfo) {
            console.log('We cannot determine the company that executed', sourceTransformation.name);
            continue;
        }

        const sourceNode: Node = new Node(
            sourceTransformation?.id,
            (sourceTransformation.processesNames||[]).join(', ')+'\n'+sourceTransformation?.name,
        );
        nodes.push(sourceNode);

        const material = supplyChainInfo.materials.find(m => m.id === mId);
        const percentage = transformation.input_material_id_percentage_map.get(mId);
        edges.push(new Edge(
            sourceNode.id,
            to_node.id,
            `${percentage!==100 ? percentage+'% - ' : ''}${material?.name || '-'} `
        ));
        const nextStep = await expandTransformation(sourceTransformation, sourceNode,supplyChainInfo);
        nodes = nodes.concat(nextStep.nodes);
        edges = edges.concat(nextStep.edges);
    };
    return {"nodes":nodes,"edges":edges};
}
