var testing = require('../widget-loader');

require('should');

describe('widget-loader.js tests', () => {
    it('Initialize and start widget-loader', (done) => {
        testing.init().then(() => {
            testing.start().then(() => {
                testing.should.be.an.instanceOf(Object);
                testing.loadedWidgets.should.be.an.instanceOf(Array);

                done();
            });
        });
    });
    it('Stop widget-loader', (done) => {
        testing.stop().then(() => {
            testing.should.equal(true);

            done();
        });
    });
});
