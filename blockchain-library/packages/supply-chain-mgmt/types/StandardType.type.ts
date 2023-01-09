import TransformationEvent from '../entities/standard/TransformationEvent';
import ObjectEvent from '../entities/standard/ObjectEvent';
import TransactionEvent from '../entities/standard/TransactionEvent';

export type StandardType = TransformationEvent | ObjectEvent | TransactionEvent;
