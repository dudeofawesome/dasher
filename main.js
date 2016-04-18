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
            Promise.all([widgetLoader.init(), widgetServer.init(widgetLoader), widgetViewer.init(widgetServer)]).then(() => {
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
            Promise.all([widgetLoader.start(), widgetServer.start(), widgetViewer.start()]).then(() => {
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
            Promise.all([widgetLoader.stop(), widgetServer.stop(), widgetViewer.stop()]).then(() => {
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
