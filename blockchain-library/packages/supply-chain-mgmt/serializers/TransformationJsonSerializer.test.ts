import Transformation from '../entities/Transformation';
import { TransformationJsonSerializer } from './TransformationJsonSerializer';

describe('TransformationJsonSerializer', () => {
    let transformationJsonSerializer: TransformationJsonSerializer;
    let now: Date;
    let inAMinute: Date;

    beforeAll(() => {
        transformationJsonSerializer = new TransformationJsonSerializer();
        now = new Date();
        inAMinute = new Date(now.getTime() + 60000);
    });

    it('should correctly serialize a Transformation', () => {
        const transformation = new Transformation(
            ['matIn1'],
            'matOut2',
            'testName',
            now,
            inAMinute,
            [],
            [],
            'http://test.source.url',
            'trans1',
            'testOwnerAddress',
        );

        const result = transformationJsonSerializer.serialize(transformation);

        expect(result).toEqual(JSON.stringify({
            id: transformation.id,
            ownerAddress: transformation.ownerAddress,
            materialsInIds: transformation.materialsInIds,
            materialOutId: transformation.materialOutId,
            name: transformation.name,
            startDate: transformation.startDate,
            endDate: transformation.endDate,
            processTypes: transformation.processTypes,
            processingStds: transformation.processingStds,
            sourceUrl: transformation.sourceUrl,
        }));
    });

    it('should correctly deserialize a Transformation', () => {
        const transformation = new Transformation(
            ['matIn1'],
            'matOut2',
            'testName',
            now,
            inAMinute,
            [],
            [],
            'http://test.source.url',
            'trans1',
            'testOwnerAddress',
        );
        const serializedEbEvent = JSON.stringify({
            id: transformation.id,
            ownerAddress: transformation.ownerAddress,
            materialsInIds: transformation.materialsInIds,
            materialOutId: transformation.materialOutId,
            name: transformation.name,
            startDate: transformation.startDate,
            endDate: transformation.endDate,
            processTypes: transformation.processTypes,
            processingStds: transformation.processingStds,
            sourceUrl: transformation.sourceUrl,
        });

        const result = transformationJsonSerializer.deserialize(serializedEbEvent);
        expect(result).toEqual(transformation);
    });
});
