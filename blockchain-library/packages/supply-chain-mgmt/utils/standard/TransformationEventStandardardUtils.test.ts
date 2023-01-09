import { TransformationEventStandardUtils } from './TransformationEventStandardUtils';
import Transformation from '../../entities/Transformation';
import TransformationEvent from '../../entities/standard/TransformationEvent';
import Material from '../../entities/Material';

jest.mock('nanoid', () => ({
    nanoid: jest.fn().mockReturnValue('uuid-test'),
}));

describe('TransformationEventStandard', () => {
    const ipfsHash = 'ipfsHash';

    let transformationEventStandardUtils: TransformationEventStandardUtils;

    beforeAll(() => {
        transformationEventStandardUtils = new TransformationEventStandardUtils();
    });

    it('shoud extractMaterialsFromEvent', () => {
        const transformationEvent = new TransformationEvent(
            [],
            [],
            [{ productClass: 'materialIn1', quantity: '', uom: '' }],
            [{ productClass: 'materialOut1', quantity: '', uom: '' }],
            '',
            '2020-07-10 15:00:00.000',
            '',
            '',
            'processType1',
            '',
            '',
            [{
                referenceStandard: 'processingStandard1',
                certificateID: '',
                evidenceURL: '',
                assessmentLevel: '',
                criteriaList: [],
                responsibleAgency: { partyID: '', name: '' },
            }],
        );
        const result = transformationEventStandardUtils.extractMaterialsFromEvent(transformationEvent, ipfsHash);
        const materials = [...transformationEvent.inputQuantityList, ...transformationEvent.outputQuantityList].map((m) => new Material(
            m.productClass,
            [],
            ipfsHash,
        ));
        expect(result).toEqual(materials);
    });

    it('should throws exception during materials extraction', () => {
        const transformationEvent = new TransformationEvent(
            [],
            [],
            [],
            [{ productClass: 'materialOut1', quantity: '', uom: '' }],
            '',
            '2020-07-10 15:00:00.000',
            '',
            '',
            'processType1',
            '',
            '',
            [{
                referenceStandard: 'processingStandard1',
                certificateID: '',
                evidenceURL: '',
                assessmentLevel: '',
                criteriaList: [],
                responsibleAgency: { partyID: '', name: '' },
            }],
        );

        expect(() => transformationEventStandardUtils.extractMaterialsFromEvent(transformationEvent, ipfsHash)).toThrow(
            new Error("Can't build a transformation without at least one input material and one output material"),
        );
    });

    it('shoud extractTransformationFromEvent', () => {
        const transformationEvent = new TransformationEvent(
            [],
            [],
            [{ productClass: 'materialIn1', quantity: '', uom: '' }],
            [{ productClass: 'materialOut1', quantity: '', uom: '' }],
            '',
            '2020-07-10 15:00:00.000',
            '',
            '',
            'processType1',
            '',
            '',
            [{
                referenceStandard: 'processingStandard1',
                certificateID: '',
                evidenceURL: '',
                assessmentLevel: '',
                criteriaList: [],
                responsibleAgency: { partyID: '', name: '' },
            }],
        );
        const materials = [new Material('', [], '', 'materialIn1'), new Material('', [], '', 'materialOut1')];

        const result = transformationEventStandardUtils.extractTransformationFromEvent(transformationEvent, ipfsHash, materials);
        const transformation = new Transformation(
            ['materialIn1'],
            'materialOut1',
            '',
            new Date(transformationEvent.eventTime),
            new Date(transformationEvent.eventTime),
            [transformationEvent.businessStepCode],
            transformationEvent.certifications.map((c) => c.referenceStandard),
            ipfsHash,
        );
        expect(result).toEqual(transformation);
    });

    it('should throws exception during transformation extraction', () => {
        const transformationEvent = new TransformationEvent(
            [],
            [],
            [{ productClass: 'materialIn1', quantity: '', uom: '' }],
            [{ productClass: 'materialOut1', quantity: '', uom: '' }],
            '',
            '2020-07-10 15:00:00.000',
            '',
            '',
            'processType1',
            '',
            '',
            [{
                referenceStandard: 'processingStandard1',
                certificateID: '',
                evidenceURL: '',
                assessmentLevel: '',
                criteriaList: [],
                responsibleAgency: { partyID: '', name: '' },
            }],
        );
        const materials = [new Material('', [], '', 'mat1')];

        expect(() => transformationEventStandardUtils.extractTransformationFromEvent(transformationEvent, ipfsHash, materials)).toThrow(
            new Error("Can't build a transformation without at least one input material and one output material"),
        );
    });

    it('should throws exception during transformation extraction - material id not set', () => {
        const transformationEvent = new TransformationEvent(
            [],
            [],
            [{ productClass: 'materialIn1', quantity: '', uom: '' }],
            [{ productClass: 'materialOut1', quantity: '', uom: '' }],
            '',
            '2020-07-10 15:00:00.000',
            '',
            '',
            'processType1',
            '',
            '',
            [{
                referenceStandard: 'processingStandard1',
                certificateID: '',
                evidenceURL: '',
                assessmentLevel: '',
                criteriaList: [],
                responsibleAgency: { partyID: '', name: '' },
            }],
        );
        const materials = [new Material('', [], '', 'mat1'), new Material('', [], '')];

        expect(() => transformationEventStandardUtils.extractTransformationFromEvent(transformationEvent, ipfsHash, materials)).toThrow(
            new Error('Material id is not set! The entity may not yet have been stored'),
        );
    });
});
