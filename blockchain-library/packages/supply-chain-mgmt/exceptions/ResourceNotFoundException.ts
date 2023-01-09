/* ResourceNotFoundException is an exception class throwed when a
 * resource isn't found. */
export class ResourceNotFoundException extends Error {
    constructor(resourceId: number | string, resourceName: string) {
        super(`${resourceName} with id ${resourceId} not found`);
    }
}

export default ResourceNotFoundException;
