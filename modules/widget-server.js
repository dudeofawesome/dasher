'use strict';

const log = require('book');

module.exports = {
    init: function () {
        return new Promise((resolve) => {
            log.info('Initializing widget-server');
            resolve();
        });
    },
    start: function () {
        return new Promise((resolve) => {
            log.info('Starting widget-server');
            resolve();
        });
    },
    stop: function () {
        return new Promise((resolve) => {
            log.info('Stopping widget-server');
            resolve();
        });
    }
};
