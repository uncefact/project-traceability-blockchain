import { StatusType } from './StatusType';

export class Edge {
    private _from: string;

    private _to: string;

    private _label: string;

    private _status: StatusType;

    /**
     * An edge represents one or more trades on the graph.
     * @param {string} from - id of the node from which the edge starts.
     * @param {string} to - id of the node to which the edge ends.
     * @param {string} label - The label of the edge.
     * @param {StatusType} status - Describes the level of compliance with the required processing standards.
     */
    constructor(
        from: string | undefined,
        to: string | undefined,
        label: string,
        status: StatusType,
    ) {
        if (!from || !to) {
            throw new Error('Transformation id must not be null, the entity may not yet have been stored');
        }
        this._from = from;
        this._to = to;
        this._label = label;
        this._status = status;
    }

    get from(): string {
        return this._from;
    }

    get to(): string {
        return this._to;
    }

    get label(): string {
        return this._label;
    }

    get status(): StatusType {
        return this._status;
    }
}
