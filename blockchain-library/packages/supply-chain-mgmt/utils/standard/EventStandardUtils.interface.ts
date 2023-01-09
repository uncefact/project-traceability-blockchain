/* eslint-disable no-unused-vars */
import Material from '../../entities/Material';
import Transformation from '../../entities/Transformation';
import { StandardType } from '../../types/StandardType.type';

// TODO : find a solution with static methods
export interface EventStandardUtils<T extends StandardType> {
    extractMaterialsFromEvent(t: T, ipfsHash: string): Material[];

    extractTransformationFromEvent(t: T, ipfsHash: string, materials: Material[]): Transformation;
}
