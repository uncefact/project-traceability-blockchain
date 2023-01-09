import Transformation from './Transformation';

describe('Transformation', () => {
    let transformation: Transformation;
    let now: Date;
    let inAMinute: Date;

    beforeAll(() => {
        now = new Date();
        inAMinute = new Date(now.getTime() + 60000);
        transformation = new Transformation(['matIn1', 'matIn2'], 'matOut3', 'testName', now, inAMinute, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans123');
    });

    it('should correctly initialize a new Transformation', () => {
        expect(transformation.id).toEqual('trans123');
        expect(transformation.materialsInIds).toEqual(['matIn1', 'matIn2']);
        expect(transformation.materialOutId).toEqual('matOut3');
        expect(transformation.startDate).toEqual(now);
        expect(transformation.endDate).toEqual(inAMinute);
        expect(transformation.processTypes).toEqual(['procType1']);
        expect(transformation.processingStds).toEqual(['procStandard1']);
        expect(transformation.sourceUrl).toEqual('sourceUrlTest');
        expect(transformation.ownerAddress).toBeUndefined();

        transformation = new Transformation(['matIn1', 'matIn2'], 'matOut3', 'testName', now, inAMinute, ['procType1'], ['procStandard1'], 'sourceUrlTest', 'trans123', 'testOwnerAddress');
        expect(transformation.ownerAddress).toEqual('testOwnerAddress');
    });
});
