/* eslint-disable no-unused-vars */
import { Certificate } from '../entities/Certificate';
import { Transformation } from '../entities/Transformation';

export type CustomCheck = (
    processingStd: string,
    currentTransformation: Transformation,
    preivousTransformations: Transformation[],
    certificates: Certificate[]
) => boolean;
