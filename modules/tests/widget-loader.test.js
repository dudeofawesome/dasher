var testing = require('../widget-loader');

require('should');

describe('utils.js tests', function () {
    it('Initiale widget-loader', function (done) {
        testing.init().then;
        testing.should.be.an.instanceOf(Object);

        done();
    });
    it('stop servers', function (done) {
        testing = testing.init();
        testing.stopServer().should.equal(true);

        done();
    });
});
