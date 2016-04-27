'use strict';

module.exports = (electron) => {
    return {
        api: {
            show: () => {
                let win = new electron.remote.BrowserWindow({
                    show: false
                });
                win.loadURL(`file://${__dirname}/resources/pages/widget-viewer/widget-viewer.html`);
                win.show();
            }
        },

        init: () => {
            return new Promise((resolve) => {
                resolve();
            });
        },
        start: () => {
            return new Promise((resolve) => {
                resolve();
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                resolve();
            });
        }
    };
};
