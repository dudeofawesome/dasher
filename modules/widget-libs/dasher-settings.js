'use strict';

module.exports = (electron, storage) => {
    return {
        api: {
            get: (key, question, type) => {
                return new Promise((resolve, reject) => {
                    storage.get(key, (err, value) => {
                        if (err || !value || Object.keys(value).length === 0) {
                            let win = new electron.remote.BrowserWindow({
                                show: false
                            });
                            win.loadURL(`file://${process.cwd()}/modules/resources/pages/empty/empty.html`);
                            let js = `
                                scope.questions = [
                                    {
                                        key: '${key}',
                                        question: '${question || key}',
                                        type: '${type}'
                                    }
                                ];
                                scope.$apply();
                            `;
                            win.webContents.executeJavaScript(js);

                            win.webContents.on('ipc-message', (event, arg) => {
                                console.log(event, arg);
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
