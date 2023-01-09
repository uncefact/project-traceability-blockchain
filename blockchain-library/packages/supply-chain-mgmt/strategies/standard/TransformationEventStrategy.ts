/* eslint-disable class-methods-use-this */
import IdentityEthersDriver from '../../drivers/IdentityEthersDriver';
import MaterialEthersDriver from '../../drivers/MaterialEthersDriver';
import TransformationEthersDriver from '../../drivers/TransformationEthersDriver';
import Material from '../../entities/Material';
import TransformationEvent, {Quantity} from '../../entities/standard/TransformationEvent';
import Transformation from '../../entities/Transformation';
import {resolvePromiseSequentially} from '../../utils/utils';
import StandardEventStrategy from './StandardEventStrategy.interface';

export class TransformationEventStrategy implements StandardEventStrategy<TransformationEvent> {
    private _identityDriver: IdentityEthersDriver;

    private _materialEthersDriver: MaterialEthersDriver;

    private _transformationEthersDriver: TransformationEthersDriver;

    /**
     * @param identityDriver - IdentityEthersDriver
     * @param materialEthersDriver - MaterialEthersDriver
     * @param transformationEthersDriver - TransformationEthersDriver
     */
    constructor(
        identityDriver: IdentityEthersDriver,
        materialEthersDriver: MaterialEthersDriver,
        transformationEthersDriver: TransformationEthersDriver,
    ) {
        this._identityDriver = identityDriver;
        this._materialEthersDriver = materialEthersDriver;
        this._transformationEthersDriver = transformationEthersDriver;
    }

    /**
     * Store transformation and materials from TransformationEvent standard object
     * @param {TransformationEvent} t - standard object
     * @param {string} ipfsHash - cid of ipfs
     * @param {string} externalId - id of the stored entity (in this case it will not be automatically generated)
     */
    async store(t: TransformationEvent, ipfsHash: string, externalId?: string): Promise<string | undefined> {
        try {
            const inputMaterials: Material[] = await this.computeMaterials(t.inputQuantityList, ipfsHash);
            const outputMaterials = await this.computeMaterials(t.outputQuantityList, ipfsHash);

            // store materials if there are ones
            if (inputMaterials.length < 1 || outputMaterials.length !== 1) { throw new Error("Can't build a transformation without at least one input material and one output material"); }
            // store transformation is there is one
            const newTrasformation = new Transformation(
                inputMaterials.map((inputMaterial) => inputMaterial.id || ''),
                outputMaterials[0].id || '',
                '',
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                t.certifications.map((c) => c.referenceStandard),
                ipfsHash,
                externalId
            );
            const symmetricKey = await this._transformationEthersDriver.store(newTrasformation);
            await this._transformationEthersDriver.allowRead(
                newTrasformation.id,
                this._identityDriver.publicKey,
                this._identityDriver.address,
                symmetricKey,
            );
            return newTrasformation.id;
        } catch (e) {
            throw new Error(`An error during json standard store occurs: ${e}`);
        }
    }

    /**
     * Update transformation and materials from TransformationEvent standard object
     * @param {TransformationEvent} t - standard object
     * @param {string} eventId - id of the object event
     * @param {string} ipfsHash - cid of ipfs
     * @returns the ipfs hash of the old transformationEvent
     */
    async update(t: TransformationEvent, eventId: string, ipfsHash: string): Promise<string> {
        try {
            const inputMaterials: Material[] = await this.computeMaterials(t.inputQuantityList, ipfsHash);
            const outputMaterials = await this.computeMaterials(t.outputQuantityList, ipfsHash);

            if (inputMaterials.length < 1 || outputMaterials.length !== 1) { throw new Error("Can't build a transformation without at least one input material and one output material"); }

            const oldTransformation = await this._transformationEthersDriver.retrieveByExternalEventId(eventId);
            const transformationUpdated = new Transformation(
                inputMaterials.map((inputMaterial) => inputMaterial.id || ''),
                outputMaterials[0].id || '',
                '',
                new Date(t.eventTime),
                new Date(t.eventTime),
                [t.businessStepCode],
                t.certifications.map((c) => c.referenceStandard),
                ipfsHash,
                oldTransformation.id,
                oldTransformation.ownerAddress,
            );
            await this._transformationEthersDriver.update(transformationUpdated);
            return oldTransformation.sourceUrl as string;
        } catch (e) {
            throw new Error(`An error during json standard update occurs: ${e}`);
        }
    }

    /**
     * Read an event from its eventID
     * @param eventID - id of the standard event
     * @returns the source url of the ipfs in which the transformationEvent json object is stored
     */
    async readSourceURL(eventID: string): Promise<string> {
        const transformation = await this._transformationEthersDriver.retrieveByExternalEventId(eventID);
        return transformation.sourceUrl as string;
    }

    /**
     * @returns A list of URLs references to a file stored within IPFS
     */
    async readSourcesURL(): Promise<string[]> {
        const transformations = await this._transformationEthersDriver.retrieveAll();
        const distinctTransformations = transformations.filter((transformation,i,tot) =>
            tot.findIndex(transformation2 => (transformation2.sourceUrl === transformation.sourceUrl)) === i);
        return distinctTransformations.map(t => t.sourceUrl as string);
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

        return resolvePromiseSequentially<Material>(materialFunctions);
    }

    // for now every materials have "0" as companyId
    // extractMaterialsFromEvent(t: TransformationEvent, ipfsHash: string): Material[] {
    //     const materials = [
    //         ...t.inputQuantityList,
    //         ...t.outputQuantityList,
    //     ];
    //     if (materials.length >= 2) {
    //         return materials.map((m) => new Material(
    //             m.productClass,
    //             [],
    //             ipfsHash,
    //             0,
    //         ));
    //     }
    //     throw new Error("extractMaterialsFromEvent:: Can't build a transformation without at least one input material and one output material");
    // }

    // TODO : now we assume that the output material is in the last position of the material ids array. Better solution ?
    // extractTransformationFromEvent(t: TransformationEvent, ipfsHash: string, materialIds: number[]): Transformation {
    //     const materialOutId = materialIds.pop();
    //     if (materialIds.length >= 1 && materialOutId) {
    //         return new Transformation(
    //             t.eventID,
    //             materialIds,
    //             materialOutId,
    //             '',
    //             new Date(t.eventTime),
    //             new Date(t.eventTime),
    //             [t.businessStepCode],
    //             t.certifications.map((c) => c.referenceStandard),
    //             ipfsHash,
    //             0,
    //         );
    //     }
    //     throw new Error("extractTransformationFromEvent:: Can't build a transformation without at least one input material and one output material");
    // }

    // async materialsSerializedStore(materials: Material[]) {
    //     const getMaterialStoreFunction = async (material: Material) => {
    //         const symmetricKey = await this._materialEthersDriver.store(material);
    //         await this._materialEthersDriver.allowRead(
    //             material.id,
    //             this._identityDriver.publicKey,
    //             this._identityDriver.address,
    //             symmetricKey,
    //         );
    //     };
    //     await materials.reduce(async (previousPromise, nextMaterialToStore) => {
    //         await previousPromise;
    //         return getMaterialStoreFunction(nextMaterialToStore);
    //     }, Promise.resolve());
    // }
}
