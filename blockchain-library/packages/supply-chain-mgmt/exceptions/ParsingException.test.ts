import ParsingException from './ParsingException';

describe('ParsingException', () => {
    it('should correctly throw an expection', () => {
        const throwFn = () => { throw new ParsingException('FooResource'); };
        expect(throwFn).toThrowError('Can\'t parse FooResource');
    });
});
