'use strict';

module.exports = (electron, storage) => {
    return {
        api: {
            get: (key) => {
                return new Promise((resolve, reject) => {
                    storage.get(key, (err, value) => {
                        if (err || !value || Object.keys(value).length === 0) {
                            let win = new electron.remote.BrowserWindow({
                                show: false
                            });
                            win.show();
                            reject(err);
                        } else {
                            resolve(value);
                        }
                    });
                });
            },
            set: (key, value) => {
                return new Promise((resolve, reject) => {
                    storage.set(key, value, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(value);
                        }
                    });
                });
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
