'use strict';

const log = require('book');

module.exports = (electron) => {
    let widgetViewer = {
        app: undefined,

        init: () => {
            return new Promise((resolve) => {
                log.info('Initializing widget-viewer');

                widgetViewer.app = electron.app;

                widgetViewer.app.on('ready', () => {
                    resolve();
                });

                widgetViewer.app.on('window-all-closed', () => {
                    // On OS X it is common for applications and their menu bar
                    // to stay active until the user quits explicitly with Cmd + Q
                    if (process.platform != 'darwin') {
                        widgetViewer.app.quit();
                    }
                });
            });
        },
        start: () => {
            return new Promise((resolve) => {
                log.info('Starting widget-viewer');

                widgetViewer.app.dock.hide();
                var electronScreen = electron.screen;
                var size = electronScreen.getPrimaryDisplay().workAreaSize;
                var win = new electron.BrowserWindow({
                    width: size.width,
                    height: size.height,
                    transparent: true,
                    show: false,
                    frame: false,
                    hasShadow: false // ,
                    // type: 'desktop'
                });
                win.loadURL(`file://${__dirname}/pages/widget-viewer/widget-viewer.html`);
                win.maximize();
                win.setResizable(false);
                win.setMovable(false);
                win.setFullScreenable(false);
                win.setMinimizable(false);
                // win.setClosable(false);
                // win.setVisibleOnAllWorkspaces(true);
                // win.setIgnoreMouseEvents(true);
                win.setSkipTaskbar(true);
                win.show();
                win.webContents.openDevTools();

                win.on('closed', () => {
                    win = undefined;
                });

                resolve();
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                log.info('Stopping widget-viewer');
                resolve();
            });
        }
    };

    return widgetViewer;
};
