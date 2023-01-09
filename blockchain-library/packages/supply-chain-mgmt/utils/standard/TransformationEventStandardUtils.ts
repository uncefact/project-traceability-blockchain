/* eslint-disable class-methods-use-this */
import Material from '../../entities/Material';
import TransformationEvent from '../../entities/standard/TransformationEvent';
import Transformation from '../../entities/Transformation';
import { EventStandardUtils } from './EventStandardUtils.interface';

export class TransformationEventStandardUtils implements EventStandardUtils<TransformationEvent> {
    public extractMaterialsFromEvent(t: TransformationEvent, ipfsHash: string): Material[] {
        const materials = [
            ...t.inputQuantityList,
            ...t.outputQuantityList,
        ];
        if (materials.length >= 2) {
            return materials.map((m) => new Material(
                m.productClass,
                [],
                ipfsHash,
            ));
        }
        throw new Error("Can't build a transformation without at least one input material and one output material");
    }

    // TODO : now we assume that the output material is in the last position of the materials array. Better solution ?
    public extractTransformationFromEvent(t: TransformationEvent, ipfsHash: string, materials: Material[]): Transformation {
        const materialIds = materials.map((m) => {
            if (m.id) return m.id;
            throw new Error('Material id is not set! The entity may not yet have been stored');
        });
        const materialOutId = materialIds.pop();
        if (materialIds.length >= 1 && materialOutId) {
            return new Transformation(
                materialIds,
                materialOutId,
                '',
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                t.certifications.map((c) => c.referenceStandard),
                ipfsHash,
            );
        }
        throw new Error("Can't build a transformation without at least one input material and one output material");
    }
}
