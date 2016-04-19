'use strict';

const log = require('book');
const electron = require('electron');

const widgetLoader = require('./modules/widget-loader');
const widgetServer = require('./modules/widget-server');
const widgetViewer = require('./modules/widget-viewer')(electron);

module.exports = {
    init: function () {
        log.info('Initializing Dasher');
        return new Promise((resolve, reject) => {
            Promise.all([widgetViewer.init()]).then(() => {
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
            Promise.all([widgetViewer.stop()]).then(() => {
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
