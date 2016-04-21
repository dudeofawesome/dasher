'use strict';

const log = require('book');
const electron = require('electron');

const widgetLoader = require('./modules/widget-loader');
const widgetGallery = require('./modules/widget-gallery')(electron, widgetLoader);
// const widgetServer = require('./modules/widget-server');
const widgetViewer = require('./modules/widget-viewer')(electron, widgetLoader, widgetGallery);

module.exports = {
    init: function () {
        log.info('Initializing Dasher');
        return new Promise((resolve, reject) => {
            Promise.all([widgetLoader.init(), widgetViewer.init(), widgetGallery.init()]).then(() => {
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
            Promise.all([widgetViewer.start(), widgetGallery.start()]).then(() => {
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
            Promise.all([widgetLoader.stop(), widgetViewer.stop(), widgetGallery.stop()]).then(() => {
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
