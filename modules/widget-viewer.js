'use strict';

const log = require('book');
const electron = require('electron');

let widgetViewer = {
    init: function () {
        return new Promise((resolve) => {
            log.info('Initializing widget-viewer');

            widgetViewer.app = electron.app;

            widgetViewer.app.on('ready', () => {
                resolve();
            });
        });
    },
    start: function () {
        return new Promise((resolve) => {
            log.info('Starting widget-viewer');

            widgetViewer.app.dock.hide();
            var win = new electron.BrowserWindow({
                width: 100,
                height: 100,
                transparent: true,
                show: false,
                frame: false,
                hasShadow: false,
                type: 'desktop'
            });
            win.loadURL('http://127.0.0.1:41416');
            win.maximize();
            win.setResizable(false);
            win.setMovable(false);
            win.setFullScreenable(false);
            win.setMinimizable(false);
            win.setClosable(false);
            win.setVisibleOnAllWorkspaces(true);
            win.setIgnoreMouseEvents(true);
            win.setSkipTaskbar(true);
            win.show();

            resolve();
        });
    },
    stop: function () {
        return new Promise((resolve) => {
            log.info('Stopping widget-viewer');
            resolve();
        });
    }
};

module.exports = widgetViewer;
