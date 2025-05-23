const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { describe, it } = exports.lab = Lab.script();

describe('Minimal Test Suite', () => {
    it('should pass', () => {
        expect(true).to.equal(true);
    });
});
