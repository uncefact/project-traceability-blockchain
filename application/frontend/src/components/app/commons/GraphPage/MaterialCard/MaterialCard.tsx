import React, {useEffect} from "react";
import styles from './MaterialCard.module.scss';
import {GoPrimitiveDot} from "react-icons/go";
import {
    AiOutlineDoubleLeft,
    AiOutlineDoubleRight,
    AiOutlineInfoCircle,
    AiOutlineSetting
} from "react-icons/ai";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import CompanyInfo from "../../../../../models/CompanyInfo";
import {SustainabilityCriterionPresentable} from "@unece/cotton-fetch";
import {
    defaultNodeEdgeColor, getEdgeColor,
    getNodeColor, getTradesFromEdge,
    invalidNodeEdgeColor,
    partialValidNodeEdgeColor,
    validNodeEdgeColor,
} from "../../../../../utils/supplyChainGraphUtils";
import Edge from "../../../../../models/Edge";
import SupplyChainInfo from "../../../../../models/SupplyChainInfo";
import {useMediaQuery} from "react-responsive";
import {useHistory, useRouteMatch} from "react-router-dom";
import {FaFileAlt} from "react-icons/fa";
import {RootState} from "../../../../../redux/store";
import {selectCompanyIndustrialSector} from "../../../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        companyIndustrialSector: selectCompanyIndustrialSector(state)
    }
);

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type SustainabilityCriterion = {
    value: SustainabilityCriterionPresentable | undefined
    selected: boolean,
    onClick: ()=>void
};
type Props = PropsFromRedux & {
    materialName: string,
    processes: string[],
    productCategory: string,
    sustainabilityCriteria: SustainabilityCriterion[]
    company: CompanyInfo,
    supplyChain: SupplyChainInfo | null,
    edges: Edge[]
};

export const criterionColor = (criterion: SustainabilityCriterionPresentable | undefined, supplyChain: SupplyChainInfo | null, edges: Edge[]) => {
    if (criterion){
        const nodesColor = supplyChain?.transformations.map(t => getNodeColor(criterion, t, supplyChain?.transformations || [])) || [];
        const edgesColor = edges.map(e => getEdgeColor(criterion, (getTradesFromEdge(supplyChain, e) || []).filter(t => t.name === 'Shipping')));
        let color = invalidNodeEdgeColor;
        //Grey dot: all nodes and trades are grey
        if(nodesColor.length == 0 || (nodesColor.every(v => v === defaultNodeEdgeColor) && edgesColor.every(v => v === defaultNodeEdgeColor)))
            color = defaultNodeEdgeColor;
        //Green dot: all nodes and trades are green and grey (at least one green)
        else if(nodesColor.every(v => v === validNodeEdgeColor || v === defaultNodeEdgeColor) && edgesColor.every(v => v === validNodeEdgeColor || v === defaultNodeEdgeColor))
            color = validNodeEdgeColor;
        //Yellow dot: all nodes are green, grey and yellow (at least one yellow)
        else if(nodesColor.every(v => v === validNodeEdgeColor || v === defaultNodeEdgeColor || v === partialValidNodeEdgeColor) && edgesColor.every(v => v === validNodeEdgeColor || v === defaultNodeEdgeColor || v === partialValidNodeEdgeColor))
            color = partialValidNodeEdgeColor;
        //Else red dot: at least one red node

        return color;
    }
    return "";
}

export const MaterialCard = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const match = useRouteMatch('/:companyIndustry/graph/:id');
    // @ts-ignore
    const idParam: number = Number(match?.params.id);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const [expanded, setExpanded] = React.useState(!isTabletOrMobile);
    const [selectedSustainabilityCriterion, setSelectedSustainabilityCriterion] = React.useState<SustainabilityCriterion | undefined>(undefined);

    useEffect(() => {
        if (selectedSustainabilityCriterion === undefined)
            setSelectedSustainabilityCriterion(props.sustainabilityCriteria[0]);
    }, [props.sustainabilityCriteria]);

    const toggleExpand = () => setExpanded(e => !e);

    const criteriaList = props.sustainabilityCriteria.map((s, id) => {
        const color = criterionColor(s.value, props.supplyChain, props.edges);

        const onClick = () => {
            setSelectedSustainabilityCriterion(s);
            s.onClick();
            isTabletOrMobile && toggleExpand();
        }
        return (
            <div className={`${styles.SCRow} ${s.selected && styles.SelectedRow}`} onClick={onClick} key={id}>
                <div className={styles.IconLinkContainer} style={{color}}>
                    <GoPrimitiveDot />
                </div>
                <div className={styles.MainLinkContainer}>
                    {s?.value?.name || '-'}
                </div>
            </div>
        )
    })

    if(isTabletOrMobile) {
        if(!expanded) {
            return <>
                <div className={styles.InfoButton} onClick={toggleExpand}>
                    <AiOutlineSetting />
                </div>
                <div className={styles.MaterialInfo}>
                    <div className={styles.InfoText}>
                        <p>{props.company?.visibleName || '-'}</p>
                        <p>{props.materialName || '-'}</p>
                        <p>{`${t("material_card.selected_criteria")} = `}<span style={{color: criterionColor(selectedSustainabilityCriterion?.value, props.supplyChain, props.edges)}}>{selectedSustainabilityCriterion?.value?.name}</span></p>
                    </div>
                </div>
            </>
        }
    }
    if(!expanded){
        return (
            <div className={`${styles.Card} ${styles.CardCompressed}`}>
                <OverlayTrigger placement={'right'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("material_card.compressed_tip")}</Tooltip>}>
                        <span className={styles.InfoContainer}>
                            <AiOutlineInfoCircle />
                        </span>
                </OverlayTrigger>
                <OverlayTrigger placement={'right'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("expand")}</Tooltip>}>
                    <span className={styles.ResizeContainer} onClick={toggleExpand}>
                        <AiOutlineDoubleRight />
                    </span>
                </OverlayTrigger>
            </div>
        )
    }
    return (
        <div className={`${styles.Card} ${styles.CardExpanded}`}>
            <div className={styles.CardContent}>
                <div className={styles.Topic}>
                    <h1>
                        {t("sustainability_criteria")}
                    </h1>
                    <div>
                        {criteriaList}
                    </div>
                </div>
                <div className={styles.Topic}>
                    <h1>
                        {t("documents")}
                    </h1>
                    <button onClick={()=>{history.push('/' + props.companyIndustrialSector + '/documentsHistory/'+idParam+'?material_name='+props.materialName)}} className={styles.Button}>
                        <div className={styles.IconLinkContainer}><FaFileAlt/></div>
                        <div className={styles.MainLinkContainer}>{t("material_card.doc_history")}</div>
                    </button>
                </div>
                <div className={styles.Topic}>
                    <h1>
                        {t("producer")}
                    </h1>
                    <div className={styles.InfoRow}>
                        <div className={styles.InfoLeftContainer}>Name:</div>
                        <div className={styles.InfoRightContainer}>{props.company?.visibleName || '-'}</div>
                    </div>
                    <div className={styles.InfoRow}>
                        <div className={styles.InfoLeftContainer}>Address:</div>
                        <div className={styles.InfoRightContainer}>{props.company?.location || '-'}</div>
                    </div>
                    <div className={styles.InfoRow}>
                        <div className={styles.InfoLeftContainer}>Region:</div>
                        <div className={styles.InfoRightContainer}>{props.company?.region || '-'}</div>
                    </div>
                    <div className={styles.InfoRow}>
                        <div className={styles.InfoLeftContainer}>State:</div>
                        <div className={styles.InfoRightContainer}>{props.company?.country || '-'}</div>
                    </div>
                </div>
            </div>
            <OverlayTrigger placement={'right'} overlay={<Tooltip id='tooltip' className={styles.Tooltip}>{t("collapse")}</Tooltip>}>
                <span className={styles.ResizeContainer} onClick={toggleExpand}>
                    <AiOutlineDoubleLeft />
                </span>
            </OverlayTrigger>
        </div>
    )
}

export default connector(MaterialCard);
