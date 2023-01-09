/* eslint-disable class-methods-use-this */
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import MaterialEthersDriver from '../../drivers/MaterialEthersDriver';
import TradeEthersDriver from '../../drivers/TradeEthersDriver';
import Material from '../../entities/Material';
import TransactionEvent from '../../entities/standard/TransactionEvent';
import { Quantity } from '../../entities/standard/TransformationEvent';
import Trade from '../../entities/Trade';
import { resolvePromiseSequentially } from '../../utils/utils';
import StandardEventStrategy from './StandardEventStrategy.interface';

export class TransactionEventStrategy implements StandardEventStrategy<TransactionEvent> {
    private _identityDriver: IdentityEthersDriver;

    private _materialEthersDriver: MaterialEthersDriver;

    private _tradeEthersDriver: TradeEthersDriver;

    /**
     * @param identityDriver - IdentityEthersDriver
     * @param materialEthersDriver - MaterialEthersDriver
     * @param tradeEthersDriver - TradeEthersDriver
     */
    constructor(
        identityDriver: IdentityEthersDriver,
        materialEthersDriver: MaterialEthersDriver,
        tradeEthersDriver: TradeEthersDriver,
    ) {
        this._identityDriver = identityDriver;
        this._materialEthersDriver = materialEthersDriver;
        this._tradeEthersDriver = tradeEthersDriver;
    }

    /**
     * IMPORTANT: 'quantityList' requires materials to be passed alternately between output one and input one. e.g. 4 materials -> out, in, out, in
     * Store trade and materials from TransactionEvent standard object
     * @param {TransactionEvent} t - standard object
     * @param {string} ipfsHash - cid of ipfs
     * @param {string} externalId - id of the stored entity (in this case it will not be automatically generated)
     */
    async store(t: TransactionEvent, ipfsHash: string, externalId?: string): Promise<string | undefined> {
        try {
            const materials: Material[] = await this.computeMaterials(t.quantityList, ipfsHash);

            if (materials.length < 1) { throw new Error("Can't build a trade without at least one material"); }

            const newTrade = new Trade(
                // e.g. from [out, in, out, in] get [[out, in], [out, in]]
                materials.map(m => m.id ? m.id : '').reduce((result: any[], value, index, sourceArray) =>
                    index % 2 === 0 ? [...result, sourceArray.slice(index, index + 2)] : result, []),
                '', // TODO: aggiungere nome se serve
                [t.businessStepCode],
                t.certifications.map((c) => c.referenceStandard),
                t.destinationParty.partyID,
                ipfsHash,
                externalId
            );
            const symmetricKey = await this._tradeEthersDriver.store(newTrade);
            await this._tradeEthersDriver.allowRead(
                newTrade.id,
                this._identityDriver.publicKey,
                this._identityDriver.address,
                symmetricKey,
            );
            return newTrade.id;
        } catch (e) {
            throw new Error(`An error during json standard store occurs: ${e}`);
        }
    }

    /**
     * Update transformation and materials from TransactionEvent standard object
     * @param {TransactionEvent} t - standard object
     * @param {string} eventId - id of the object event
     * @param {string} ipfsHash - cid of ipfs
     * @returns the ipfs hash of the old transactionEvent
     */
    async update(t: TransactionEvent, eventId: string, ipfsHash: string): Promise<string> {
        try {
            const materials: Material[] = await this.computeMaterials(t.quantityList, ipfsHash);

            if (materials.length < 1) { throw new Error("Can't build a trade without at least one material"); }

            const oldTransaction = await this._tradeEthersDriver.retrieveByExternalEventId(eventId);
            const transactionUpdated = new Trade(
                materials.map((m) => (m.id ? [m.id, m.id] : ['', ''])),
                '',
                [t.businessStepCode],
                t.certifications.map((c) => c.referenceStandard),
                t.destinationParty.partyID,
                ipfsHash,
                oldTransaction.id,
                oldTransaction.ownerAddress,
            );
            await this._tradeEthersDriver.update(transactionUpdated);
            return oldTransaction.sourceUrl as string;
        } catch (e) {
            throw new Error(`An error during json standard update occurs: ${e}`);
        }
    }

    /**
     * Read an event from its eventID
     * @param eventID - id of the standard event
     * @returns the source url of the ipfs in which the transactionEvent json object is stored
     */
    async readSourceURL(eventID: string): Promise<string> {
        const transaction = await this._tradeEthersDriver.retrieveByExternalEventId(eventID);
        return transaction.sourceUrl as string;
    }

    /**
     * @returns A list of URL's references to a file stored within IPFS
     */
    async readSourcesURL(): Promise<string[]> {
        const trades = await this._tradeEthersDriver.retrieveAll();
        const distinctTrades = trades.filter((trade,i,tot) =>
            tot.findIndex(trade2 => (trade2.sourceUrl === trade.sourceUrl)) === i);
        return distinctTrades.map(t => t.sourceUrl as string);
    }

    async computeMaterials(quantityList: Quantity[], ipfsHash: string): Promise<Material[]> {
        const oldMaterials: Material[] = await this._materialEthersDriver.retrieveAll();
        const materialFunctions = quantityList.map((inputQuantity) => async () => {
            const oldMaterial = oldMaterials.find((mat) => mat.name === inputQuantity.productClass);
            const newMaterial: Material = oldMaterial
                ? new Material(
                    inputQuantity.productClass,
                    [], // take from inputQuantity when available
                    ipfsHash,
                    oldMaterial.id,
                    oldMaterial.ownerAddress,
                )
                : new Material(inputQuantity.productClass, [], ipfsHash);

            if (oldMaterial && !newMaterial.equals(oldMaterial)) {
                await this._materialEthersDriver.update(newMaterial);
            } else {
                const symmetricKey = await this._materialEthersDriver.store(newMaterial);
                await this._materialEthersDriver.allowRead(
                    newMaterial.id,
                    this._identityDriver.publicKey,
                    this._identityDriver.address,
                    symmetricKey,
                );
            }
            return newMaterial;
        });

        const results = await resolvePromiseSequentially<Material>(materialFunctions);
        return results;
    }
}
