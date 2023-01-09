import React from "react";
import {mocked} from "ts-jest/utils";
// @ts-ignore
import Graph from "react-graph-vis";
import ReactTooltip from 'react-tooltip';
import Enzyme, {mount} from "enzyme";
import {GraphPage} from "./GraphPage";
import Adapter from "enzyme-adapter-react-16";
import {act} from "react-dom/test-utils";
import SustainabilityCriteriaControllerApi from "../../../../api/SustainabilityCriteriaControllerApi";
import {Button} from "react-bootstrap";
import SupplyChainInfoControllerApi from "../../../../api/SupplyChainInfoControllerApi";
import {expandTransformation, findTransformation} from "../../../../utils/blockchainUtils";
import {asyncPipe} from "../../../../utils/basicUtils";
import {getSustainabilityCriteriaCondition} from "../../../../utils/supplyChainGraphUtils";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-graph-vis', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Graph'}>{children}</div>)
});

jest.mock('react-tooltip', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'ReactTooltip'}>{children}</div>)
});

jest.mock('../../../../api/SustainabilityCriteriaControllerApi', () => {
    return {
        getSustainabilityCriteria: jest.fn()
    }
});

jest.mock('../../../../api/SupplyChainInfoControllerApi', () => {
    return {
        getSupplyChain: jest.fn()
    }
});

jest.mock('react-bootstrap', () => {
    return {
        Button: jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>),
    }
});

// in questo modo posso mockare dallo stesso modulo sia un default export sia un named export
jest.mock('./MaterialCard/MaterialCard', () => {
    return {
        __esModule: true,
        criterionColor: jest.fn(),
        default: jest.fn().mockImplementation(({children}) => <div className={'MaterialCard'}>{children}</div>),
    }
});
jest.mock('./SelectedNodeCard/SelectedNodeCard', () => {
    return {
        SelectedNodeCard: jest.fn().mockImplementation(({children}) => <div className={'SelectedNodeCard'}>{children}</div>),
    }
});

jest.mock('./MockedGraph', () => {
    return {
        defaultNodeColor: '#000000',
        validNodeColor: '#ff0000',
        getSustainabilityCriteriaCondition: jest.fn()
    }
});

jest.mock('../../../../utils/basicUtils', () => {
    return {
        asyncPipe: jest.fn(),
    }
});

jest.mock('../../../../utils/blockchainUtils', () => {
    return {
        expandTransformation: jest.fn(),
        findTransformation: jest.fn(),
    }
});
jest.mock('react-resize-detector', () => {
    return {
        useResizeDetector: jest.fn().mockReturnValue({
            ref: null
        }),
    }
});

jest.mock('react-router-dom', () => {
    return {
        useRouteMatch: jest.fn().mockReturnValue({
            params: {
                id: 1
            }
        }),
    }
});


describe('GraphPage test', () => {
    const MockedGraph = mocked(Graph, true);
    const MockedReactTooltip = mocked(ReactTooltip, true);
    const MockedButton = mocked(Button, true);
    const MockedGetAllSustainabilityCriteria = mocked(SustainabilityCriteriaControllerApi.getSustainabilityCriteria, true);
    const MockedGetSustainabilityCriteriaCondition = mocked(getSustainabilityCriteriaCondition, true);
    const MockedGetSupplyChain = mocked(SupplyChainInfoControllerApi.getSupplyChain, true);
    const MockedExpandTransformation = mocked(expandTransformation, true);
    const MockedFindTransformation = mocked(findTransformation, true);
    const MockedAsyncPipe = mocked(asyncPipe,true);

    const addErrorMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Render without crashing', async () => {
        MockedAsyncPipe.mockReturnValue(() =>{})
        await act(async () => {
            await mount(
                <GraphPage addErrorMessage={addErrorMessage}/>
            );
        })
    });
    //TODO FIX
    // it('Apply sustainability credential test', async () => {
    //     const sustainabilityCriteria = [{
    //         id: 1,
    //         name: 'Criterion1Test'
    //     }, {
    //         id: 2,
    //         name: 'Criterion2Test'
    //     }]
    //     MockedGetAllSustainabilityCriteria.mockReturnValue(Promise.resolve(sustainabilityCriteria));
    //     MockedGetSustainabilityCriteriaCondition.mockReturnValue(()=>true);
    //     let component;
    //     await act(async () => {
    //         component = await mount(
    //             <ReactGraphVis />
    //         );
    //     })
    //     expect(MockedButton).toHaveBeenCalledTimes(4);
    //     act(() => {
    //         // @ts-ignore
    //         MockedButton.mock.calls[2][0].onClick();
    //     });
    //     expect(MockedGraph).toHaveBeenCalledTimes(4);
    //     expect(MockedGraph.mock.calls[2][0].graph).toEqual({
    //         edges: [
    //             {from: 1, to: 2},
    //             {from: 2, to: 3}
    //         ],
    //         nodes: [
    //             {id: 1, label: 'Node 1 test', color:'#ff0000', info: {facilityName: 'facilityNameTest1', location: 'locationTest1', nation: 'nationTest1', region: 'regionTest1', certificates: ['CERT1']}},
    //             {id: 2, label: 'Node 2 test', color:'#ff0000', info: {facilityName: 'facilityNameTest2', location: 'locationTest2', nation: 'nationTest2', region: 'regionTest2', certificates: ['CERT2']}},
    //             {id: 3, label: 'Node 3 test', color:'#ff0000', info: {facilityName: 'facilityNameTest3', location: 'locationTest3', nation: 'nationTest3', region: 'regionTest3', certificates: ['CERT3']}}
    //         ]
    //     });
    // });
    // it('Graph props test - graph', async () => {
    //     MockedGetAllSustainabilityCriteria.mockReturnValue(Promise.resolve([]));
    //     await act(async () => {
    //         await mount(
    //             <ReactGraphVis />
    //         );
    //     })
    //     expect(MockedGraph).toHaveBeenCalledTimes(2);
    //     expect(MockedGraph.mock.calls[1][0].graph).toEqual({
    //         edges: [
    //             {from: 1, to: 2},
    //             {from: 2, to: 3}
    //         ],
    //         nodes: [
    //             {id: 1, label: 'Node 1 test', color:'#000000', info: {facilityName: 'facilityNameTest1', location: 'locationTest1', nation: 'nationTest1', region: 'regionTest1', certificates: ['CERT1']}},
    //             {id: 2, label: 'Node 2 test', color:'#000000', info: {facilityName: 'facilityNameTest2', location: 'locationTest2', nation: 'nationTest2', region: 'regionTest2', certificates: ['CERT2']}},
    //             {id: 3, label: 'Node 3 test', color:'#000000', info: {facilityName: 'facilityNameTest3', location: 'locationTest3', nation: 'nationTest3', region: 'regionTest3', certificates: ['CERT3']}}
    //         ]
    //     });
    // });
});