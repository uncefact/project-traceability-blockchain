import ResourceNotFoundException from './ResourceNotFoundException';

describe('ResourceNotFoundException', () => {
    it('should correctly throw an expection', () => {
        const throwFn = () => { throw new ResourceNotFoundException(123, 'foo'); };
        expect(throwFn).toThrowError('foo with id 123 not found');
    });
});
