/* eslint-disable no-unused-vars */

export interface EntitySerializer<T> {
    serialize(t: T): string;

    deserialize(serializedT: string): T;
}

export default EntitySerializer;
