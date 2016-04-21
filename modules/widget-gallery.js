'use strict';

const log = require('book');

module.exports = (app, widgetLoader) => {
    let widgetGallery = {
        window: undefined,

        init: () => {
            return new Promise((resolve) => {
                resolve();
            });
        },
        start: () => {
            return new Promise((resolve) => {
                log.info('Starting widget-gallery');
                resolve();
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                log.info('Stopping widget-gallery');
                resolve();
            });
        },

        show: () => {
            if (!widgetGallery.window) {
                app.dock.hide();
                widgetGallery.window = new electron.BrowserWindow({
                    width: size.width,
                    height: size.height,
                    transparent: true,
                    show: false,
                    frame: false,
                    hasShadow: false,
                    type: 'desktop'
                });
                widgetGallery.window.loadURL(`file://${__dirname}/resources/pages/widget-viewer/widget-viewer.html`);
                widgetGallery.window.maximize();
                widgetGallery.window.setResizable(false);
                widgetGallery.window.setMovable(false);
                widgetGallery.window.setFullScreenable(false);
                widgetGallery.window.setMinimizable(false);
                // widgetGallery.window.setClosable(false);
                widgetGallery.window.setVisibleOnAllWorkspaces(true);
                widgetGallery.window.setIgnoreMouseEvents(true);
                widgetGallery.window.setSkipTaskbar(true);
                widgetGallery.window.show();

                widgetGallery.window.on('closed', () => {
                    widgetGallery.window = undefined;
                });
            }
        }
    };

    return widgetGallery;
};
