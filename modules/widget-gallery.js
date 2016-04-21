'use strict';

const log = require('book');

module.exports = (electron, widgetLoader) => {
    let widgetGallery = {
        window: undefined,

        init: () => {
            return new Promise((resolve) => {
                log.info('Initializing widget-gallery');
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
                electron.app.dock.show();
                widgetGallery.window = new electron.BrowserWindow({
                    // width: size.width,
                    // height: size.height,
                    frame: false,
                    show: false
                });
                widgetGallery.window.loadURL(`file://${__dirname}/resources/pages/widget-gallery/widget-gallery.html`);
                widgetGallery.window.show();

                widgetGallery.window.on('closed', () => {
                    electron.app.dock.hide();
                    widgetGallery.window = undefined;
                });
            }
        }
    };

    return widgetGallery;
};
