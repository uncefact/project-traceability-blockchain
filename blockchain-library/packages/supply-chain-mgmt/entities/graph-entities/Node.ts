import { StatusType } from './StatusType';

export class Node {
    private _id: string;

    private _label: string;

    private _status: StatusType;

    /**
     * A node represents a transformation on the graph.
     * @param {string | undefined} id - The id of the node.
     * @param {string} label - The label of the node.
     * @param {StatusType} status - Describes the level of compliance with the required processing standards.
     */
    constructor(
        id: string | undefined,
        label: string,
        status: StatusType,
    ) {
        if (!id) {
            throw new Error('Transformation id must not be null, the entity may not yet have been stored');
        }
        this._id = id;
        this._label = label;
        this._status = status;
    }

    get id(): string {
        return this._id;
    }

    get label(): string {
        return this._label;
    }

    get status(): StatusType {
        return this._status;
    }
}
