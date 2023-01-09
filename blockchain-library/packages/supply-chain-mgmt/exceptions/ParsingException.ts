/* ParsingException is an exception class throwed when it isn't possible to parse
 * a certain resource. */
export class ParsingException extends Error {
    constructor(resourceName: string) {
        super(`Can't parse ${resourceName}`);
    }
}

export default ParsingException;
