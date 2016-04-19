'use strict';

const log = require('book');
const electron = require('electron');

const widgetLoader = require('./modules/widget-loader');
// const widgetServer = require('./modules/widget-server');
const widgetViewer = require('./modules/widget-viewer')(electron, widgetLoader);

module.exports = {
    init: function () {
        log.info('Initializing Dasher');
        return new Promise((resolve, reject) => {
            Promise.all([widgetLoader.init(), widgetViewer.init()]).then(() => {
                resolve();
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    },
    start: function () {
        log.info('Starting Dasher');
        return new Promise((resolve, reject) => {
            Promise.all([widgetViewer.start()]).then(() => {
                resolve();
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    },
    stop: function () {
        log.info('Stopping Dasher');
        return new Promise((resolve, reject) => {
            Promise.all([widgetLoader.stop(), widgetViewer.stop()]).then(() => {
                resolve();
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
};

module.exports.init().then(() => {
    module.exports.start();
});

process.on('exit', () => {
    module.exports.stop();
});
