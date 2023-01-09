import { Material } from '../Material';
import { Trade } from '../Trade';
import { Transformation } from '../Transformation';
import { Certificate } from '../Certificate';

export class SupplyChainInput {
    private _materials: Array<Material>;

    private _transformations: Array<Transformation>;

    private _trades: Array<Trade>;

    private _certificates: Array<Certificate>;

    /**
     * A SypplyChainInput is the data resulting a query on the supply chain retrieving the elements needed to build the graph.
     * @param materials - The materials used in the current supply chain.
     * @param transformations - An array of transformation used in the current supply chain..
     * @param trades - An array of trades used in the current supply chain.
     * @param certificates - An array of certificates used in the current supply chain.
     */
    constructor(
        materials: Array<Material>,
        transformations: Array<Transformation>,
        trades: Array<Trade>,
        certificates: Array<Certificate>,
    ) {
        this._materials = materials;
        this._transformations = transformations;
        this._trades = trades;
        this._certificates = certificates;
    }

    get materials(): Array<Material> {
        return this._materials;
    }

    get transformations(): Array<Transformation> {
        return this._transformations;
    }

    get trades(): Array<Trade> {
        return this._trades;
    }

    get certificates(): Array<Certificate> {
        return this._certificates;
    }
}
