import React, {useCallback, useEffect} from "react";
// @ts-ignore
import Graph from "react-graph-vis";
import './network.css'

import SustainabilityCriteriaControllerApi from "../../../../api/SustainabilityCriteriaControllerApi";
import styles from "./GraphPage.module.scss";
import {
    SupplyChainCompanyInfoPresentable, SupplyChainMaterialPresentable,
    SustainabilityCriterionPresentable,
    SupplyChainTransformationPresentable, SupplyChainTradePresentable
} from "@unece/cotton-fetch";
import SupplyChainInfo from "../../../../models/SupplyChainInfo";
import SupplyChainInfoControllerApi from "../../../../api/SupplyChainInfoControllerApi";
import Node from "../../../../models/Node";
import Edge from "../../../../models/Edge";
import {v4 as uuidv4} from "uuid"
import CompanyInfo from "../../../../models/CompanyInfo";
import Material from "../../../../models/Material";
import Trade from "../../../../models/Trade";
import Transformation from "../../../../models/Transformation";
import {expandTransformation, findTransformation} from "../../../../utils/blockchainUtils";
import {useRouteMatch} from "react-router-dom";
import MaterialCard, {criterionColor} from "./MaterialCard/MaterialCard";
import {useResizeDetector} from 'react-resize-detector';
import {SelectedEdge, SelectedNodeCard, SelectedNode} from "./SelectedNodeCard/SelectedNodeCard";
import {asyncPipe, moveElementFirstByFieldValue} from "../../../../utils/basicUtils";
import moment from "moment";
import Certificate from "../../../../models/Certificate";
import {connect, ConnectedProps} from "react-redux";
import {addErrorMessage} from "../../../../redux/store/Messages/actions";
import {getEdgeColor, getNodeColor, getNodeLabel, getTradesFromEdge} from "../../../../utils/supplyChainGraphUtils";
import {useTranslation} from "react-i18next";

//https://github.com/crubier/react-graph-vis

type GraphHoverEvent = {
    node: number,
}
type GraphClickEvent = {
    nodes: number[],
    edges: number[]
}
type FacilityInfo = {
    facilityName: string,
    location: string,
    nation: string,
    region: string,
    processTypes: string[],
    standards: string[],
    certificates: string[]
}

type MaterialCompany = {
    name: string,
    location: string,
    region: string,
    nation: string,
}

const mapDispatch = {
    addErrorMessage
};


const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
};

export const GraphPage = (props:Props) => {
    const { t } = useTranslation();
    const [tooltipText, setTooltipText] = React.useState('');
    const [graphState, setGraphState] = React.useState<{ "nodes": Node[], "edges": Edge[], "key": string }>({
        "nodes": [],
        "edges": [],
        "key": uuidv4()
    });

    const [sustainabilityCriteria, setSustainabilityCriteria] = React.useState<SustainabilityCriterionPresentable[]>([]);
    const [selectedSustainabilityCriterion, setSelectedSustainabilityCriterion] = React.useState<SustainabilityCriterionPresentable | undefined>(undefined);
    const [initStateLoading, setInitStateLoading] = React.useState<boolean>(false);
    const [materialName, setMaterialName] = React.useState<string>('');
    const [materialProcesses, setMaterialProcesses] = React.useState<string[]>([]);
    const [materialCompany, setMaterialCompany] = React.useState<CompanyInfo | null>(null);

    const [supplyChain, setSupplyChain] = React.useState<SupplyChainInfo | null>(null);

    const [selectedNode, setSelectedNode] = React.useState<SelectedNode | null>(null);
    const [selectedEdge, setSelectedEdge] = React.useState<SelectedEdge | null>(null);

    const match = useRouteMatch('/:companyIndustry/graph/:id');
    // @ts-ignore
    const idParam: number = Number(match?.params.id);

    const retrieveSustainabilityCriteria = async () => {
        try {
            const resp = await SustainabilityCriteriaControllerApi.getSustainabilityCriteria();
            const criterionList = moveElementFirstByFieldValue(resp, "name", "Origin");
            setSustainabilityCriteria(criterionList);
            return criterionList;
        } catch (e) {
            console.error('getSustainabilityCriteria error');
        }
    }
    useEffect(() => {
        setInitStateLoading(true);
        // @ts-ignore
        const combineRequest = asyncPipe(
            async (id: any) => await loadGraph(id),
            async (supplyChainInfo: SupplyChainInfo) => {
                const criterionList = await retrieveSustainabilityCriteria();
                return {"criterionList": criterionList, "supplyChainInfo": supplyChainInfo}
            },
            async (defaultData: any) => await updateSupplyChainWithSustainabilityCriterion(defaultData.criterionList[0], defaultData.supplyChainInfo),
            () => setInitStateLoading(false)
        );
        combineRequest(idParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
                nodeSpacing: 600,
                levelSeparation: 300,
            }
        },
        nodes: {
            shape: "dot",
            size: 30,
            font: {
                size: 20,
                color: "#000000",
                background: "#ffffff",
                multi: true
            },
            borderWidth: 2,
            widthConstraint: {
                maximum: 600
            }
        },
        edges: {
            width: 2,
            font: {
                size: 16,
                color: "#000000",
                background: "#ffffff"
            },
        },
        interaction: {
            hover: true,
            zoomView: true
        },
        physics: {enabled: false}
    };

    const events = {
        // hoverNode: (event: GraphHoverEvent) => {
        //     const node = graphState.nodes.find(n => n.id === event.node);
        //     if(node){
        //         setTooltipText(getStyledTooltipText(node.info));
        //     }
        // },
        click: (event: GraphClickEvent) => {
            removeSelection();
            if (event.nodes.length === 0 && event.edges.length > 0) { //Edge clicked
                const edge = graphState.edges.find((e: any) => e.id === event.edges[0]) || null;
                const trades = getTradesFromEdge(supplyChain, edge);

                const transformationFrom = supplyChain?.transformations?.find((t: any) => t.id === edge?.from) || null;
                const transformationTo = supplyChain?.transformations?.find((t: any) => t.id === edge?.to) || null;

                const facilityFrom = supplyChain?.companiesInfo?.filter((c: CompanyInfo) => c?.name === transformationFrom?.executor_company_id)?.[0] || null;
                const facilityTo = supplyChain?.companiesInfo?.filter((c: CompanyInfo) => c?.name === transformationTo?.executor_company_id)?.[0] || null;

                setSelectedEdge({
                    fromFacilityInfo: {
                        name: facilityFrom?.visibleName || null,
                        location: facilityFrom?.location || null,
                        country: facilityFrom?.country || null,
                        region: facilityFrom?.region || null,
                        certificates: [],
                        partnerTyp: facilityFrom?.partnerTyp || null
                    },
                    toFacilityInfo: {
                        name: facilityTo?.visibleName || null,
                        location: facilityTo?.location || null,
                        country: facilityTo?.country || null,
                        region: facilityTo?.region || null,
                        certificates: [],
                        partnerTyp: facilityTo?.partnerTyp || null
                    },
                    trades: trades?.map(t => ({
                        tradeName: t.name,
                        tradeRefNumber: t.reference_number,
                        date: t.date ? moment(t.date).format('MM/DD/YYYY') : null,
                        processingStandards: t?.processing_standards || [],
                        tradeCertificates: t.certificates,
                    })) || []
                });
                return;
            } else if (event.nodes.length === 1) {//Node clicked
                const node = graphState.nodes.find(n => n.id === event.nodes[0]) || null;
                const transformation = supplyChain?.transformations?.filter((t: Transformation) => t?.id === node?.id)?.[0] || null;
                const outputMaterial = supplyChain?.materials?.filter((m: Material) => m?.id === transformation?.output_material_ids[0])?.[0] || null;
                const facility = supplyChain?.companiesInfo?.filter((c: CompanyInfo) => c?.name === transformation?.executor_company_id)?.[0] || null;

                setSelectedNode({
                    materialName: outputMaterial?.name || null,
                    materialCategory: transformation?.product_category || null,
                    facilityInfo: {
                        name: facility?.visibleName || null,
                        location: facility?.location || null,
                        country: facility?.country || null,
                        region: facility?.region || null,
                        certificates: [],
                        partnerTyp: facility?.partnerTyp || null
                    },
                    processName: transformation?.name || null,
                    processTypes: transformation?.processesNames || null,
                    processingStandards: transformation?.processing_standards || [],
                    certificates: transformation?.certificates || [],
                    transformationId: transformation?.id || null
                });
                console.log(transformation?.certificates)
            }
        },
        blurNode: () => {
            setTooltipText('');
        }
    };

    const removeSelection = () => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }

    const generateGraph = async (supplyChainInfo: SupplyChainInfo, materialId: number): Promise<{ "nodes": Node[], "edges": Edge[] }> => {
        const transformation = findTransformation(materialId, supplyChainInfo)
        if (!transformation) {
            console.log('For the material ' + materialId + ' we cannot find a transformation in our supply chain');
            return {"nodes": [], "edges": []};
        }
        const toNode: Node = new Node(
            transformation?.id,
            (transformation.processesNames || []).join(', ') + '\n' + transformation?.name,
        )
        let myNodes: Node[] = [toNode]
        let myEdges: Edge[] = []
        const nextStep = await expandTransformation(transformation, toNode, supplyChainInfo);
        const finalNodes = myNodes.concat(nextStep.nodes);
        const finalEdges = myEdges.concat(nextStep.edges);
        return {"nodes": finalNodes, "edges": finalEdges}
    };

    const loadGraph = async (materialId: number) => {
        try {
            const resp = await SupplyChainInfoControllerApi.getSupplyChain({
                materialId: materialId,
            });
            const myCompanySupplyChainInfo: SupplyChainInfo = new SupplyChainInfo(
                resp?.companiesInfo?.map((c: SupplyChainCompanyInfoPresentable) => new CompanyInfo(c.visibleName || '', c.name || '', c.location || '', c.country || '', c.region || '', c.partnerType || '')),
                resp?.materials?.map((m: SupplyChainMaterialPresentable) => new Material(m.name || '', m.id || -1)),
                resp?.trades?.map((t: SupplyChainTradePresentable) => new Trade(
                    t.type || '',
                    t.referenceNumber || '',
                    t.creationDate || null,// @ts-ignore
                    new Map<number, number>(Object.entries(t?.consigneeToContractorMaterialMap).map(a => [Number(a[0]), a[1]])),// @ts-ignore
                    t?.documentType,
                    t?.processingStandards || [],// @ts-ignore
                    t.certificates?.map(c => (new Certificate(
                        c.certificateId || "",
                        c.certifierName || "",
                        c.processingStandardName || "",
                        c.assessmentTypeName || "",
                        c.processingStandardLogoPath || "",
                        c.processingStandardSiteUrl || "",
                        c.processTypes || [],
                        c.validUntil ? moment(c.validUntil).format('MM/DD/YYYY') : "",
                        c.validFrom ? moment(c.validFrom).format('MM/DD/YYYY') : "",
                        c.certificateTypeName || "",
                        c.documentId || null,
                        c.documentFileName || null,
                        c.subject?.toString() || null,
                        c.status || null
                    ))) || []
                )),
                resp?.transformations?.map((t: SupplyChainTransformationPresentable) => new Transformation(t.id || -1,
                    t.name || '',
                    t.productCategory || '',
                    t.outputMaterialIds || [],
                    t.inputMaterialIds || [],
                    t.executorCompanyId || '',
                    t.processesTypeNames || [],
                    // @ts-ignore
                    new Map<number, number>(Object.entries(t?.inputMaterialIdPercentageMap).map(a => [Number(a[0]), a[1]])),
                    t?.processingStandards || [],// @ts-ignore
                    t.certificates?.map(c => (new Certificate(
                        c.certificateId || "",
                        c.certifierName || "",
                    c.processingStandardName || "",
                        c.assessmentTypeName || "",
                    c.processingStandardLogoPath || "",
                        c.processingStandardSiteUrl || "",
                        c.processTypes || [],
                        c.validUntil ? moment(c.validUntil).format('MM/DD/YYYY') : "",
                        c.validFrom ? moment(c.validFrom).format('MM/DD/YYYY') : "",
                        c.certificateTypeName || "",
                        c.documentId || null,
                        c.documentFileName || null,
                        c.subject?.toString() || null,
                        c.status || null,
                        c.certificatePageURL || null
                    ))) || []
                )));
            setMaterialName(resp?.materials?.find((m: SupplyChainMaterialPresentable) => m.id === materialId)?.name || '');
            const lastTransformation = resp?.transformations?.find((t: SupplyChainTransformationPresentable) => t?.outputMaterialIds?.includes(materialId));
            setMaterialProcesses(lastTransformation?.processesTypeNames || []);
            setMaterialCompany(myCompanySupplyChainInfo?.companiesInfo?.find(c => c.name === lastTransformation?.executorCompanyId) || null);
            const myGraph = await generateGraph(myCompanySupplyChainInfo, materialId);
            setGraphState({"nodes": myGraph.nodes, "edges": myGraph.edges, "key": uuidv4()});
            setSupplyChain(myCompanySupplyChainInfo);
            return myCompanySupplyChainInfo;
        } catch (e) {
            props.addErrorMessage(t("popups.errors.material_info"));
        }
    }

    const updateSupplyChainWithSustainabilityCriterion = async (criterion: SustainabilityCriterionPresentable | null, supplyChain: SupplyChainInfo | null) => {
        if(!criterion || !supplyChain)
            return;
        setSelectedSustainabilityCriterion(criterion)
        setGraphState((gs: { "nodes": Node[], "edges": Edge[], "key": string }) => {
            const newNodes = gs.nodes
                .map((node: Node) => {
                    const transformation = supplyChain?.transformations?.filter((t: Transformation) => t?.id === node?.id)?.[0] || null;
                    const facility = supplyChain?.companiesInfo?.filter((c: CompanyInfo) => c?.name === transformation?.executor_company_id)?.[0] || null;
                    return {
                        ...node,
                        label: getNodeLabel(criterion)(transformation, facility),
                        color: getNodeColor(criterion, transformation, supplyChain?.transformations || [])
                    }
                });
            const newEdges = gs.edges
                .map((edge: Edge) => {
                    const shippings = (getTradesFromEdge(supplyChain, edge) || []).filter(t => t.name === 'Shipping') ;
                    return {
                        ...edge,
                        color: getEdgeColor(criterion, shippings)
                    }
                });
            return {
                nodes: newNodes,
                edges: newEdges,
                key: uuidv4()
            };
        });
    }

    const sustainabilityCriteriaToShow = sustainabilityCriteria?.map(c => {
        return {
            value: c,
            selected: selectedSustainabilityCriterion === c,
            onClick: () => updateSupplyChainWithSustainabilityCriterion(c, supplyChain)
        }
    });
    const onResize = useCallback(() => {
        setGraphState(g => ({
            ...g,
            key: uuidv4()
        }));
    }, []);

    const {ref} = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 100,
        onResize
    });

    return (
        <div className={styles.GraphContainer}>
            <MaterialCard
                sustainabilityCriteria={sustainabilityCriteriaToShow}
                company={materialCompany || {
                    visibleName: '',
                    name: '',
                    location: '',
                    region: '',
                    country: '',
                    partnerTyp: ''
                }}
                materialName={materialName}
                processes={materialProcesses}
                productCategory={''}
                supplyChain={supplyChain}
                edges={graphState.edges || []}
            />
            <div className={styles.MainContent}>
                <div className={styles.TitleSection}>
                    <h1>{materialName}</h1>
                    <p>{`${t("material_card.selected_criteria")} = `}<span style={{color: criterionColor(selectedSustainabilityCriterion, supplyChain, graphState.edges)}}>{selectedSustainabilityCriterion?.name}</span></p>
                </div>
                <div
                    // data-tip=''
                    // data-for='Tooltip'
                    ref={ref}
                    className={styles.GraphVisContainer}>
                    {
                        !initStateLoading &&
                        <Graph
                            key={graphState.key}
                            graph={graphState}
                            options={options}
                            events={events}
                        />
                    }
                </div>
            </div>

            {/*<ReactTooltip id='Tooltip' getContent={()=>tooltipText} html={true} place={'right'} backgroundColor={'#343A40'}/>*/}
            <SelectedNodeCard
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                selectedSustainabilityCriterion={selectedSustainabilityCriterion}
                onClose={removeSelection}
                transformations={supplyChain?.transformations || []}/>
        </div>
    );
}

export default connector(GraphPage);
