'use strict';

module.exports = (electron, storage) => {
    let dasherSettings = {
        api: {
            get: (key, question, type, disableSave) => {
                return new Promise((resolve, reject) => {
                    if (Array.isArray(key)) {
                        let requestedQuestions = key;

                        let storagePromises = [];
                        for (let i in requestedQuestions) {
                            storagePromises.push(new Promise((resolve, reject) => {
                                storage.get(key, (err, value) => {
                                    resolve(value);
                                });
                            }));
                        }

                        Promise.all(storagePromises).then((results) => {
                            let missingQuestions = [];
                            for (let i in results) {
                                if (!results[i]) {
                                    missingQuestions.push({
                                        key: requestedQuestions[i].key,
                                        question: requestedQuestions[i].question || requestedQuestions[i].key,
                                        type: requestedQuestions[i].type
                                    });
                                }
                            }

                            let win = new electron.remote.BrowserWindow({
                                frame: process.platform === 'darwin',
                                titleBarStyle: 'hidden',
                                show: false
                            });
                            win.loadURL(`file://${process.cwd()}/modules/resources/pages/settings/settings.html`);
                            let js = `
                                scope.questions = ${JSON.stringify(missingQuestions)};
                                scope.$apply();
                            `;
                            win.webContents.executeJavaScript(js);

                            win.webContents.on('ipc-message', (event, responses) => {
                                if (disableSave) {
                                    resolve(responses[1]);
                                } else {
                                    let resolvedStores = 0;
                                    for (let i in responses[1]) {
                                        dasherSettings.api.set(responses[1][i].key, responses[1][i].answer).then(() => {
                                            resolvedStores++;
                                            if (resolvedStores >= responses[1].length) {
                                                resolve(responses[1]);
                                            }
                                        }).catch(() => {
                                            resolvedStores++;
                                            if (resolvedStores >= responses[1].length) {
                                                resolve(responses[1]);
                                            }
                                        });
                                    }
                                }
                            });

                            win.on('window-close', () => {
                                reject();
                            });

                            win.show();
                        });
                    } else {
                        storage.get(key, (err, value) => {
                            if (err || !value || Object.keys(value).length === 0) {
                                let win = new electron.remote.BrowserWindow({
                                    show: false
                                });
                                win.loadURL(`file://${process.cwd()}/modules/resources/pages/empty/empty.html`);
                                let questions = [
                                    {
                                        key: key,
                                        question: question || key,
                                        type: type
                                    }
                                ];
                                let js = `
                                    scope.questions = ${JSON.stringify(questions)};
                                    scope.$apply();
                                `;
                                win.webContents.executeJavaScript(js);

                                win.webContents.on('ipc-message', (event, responses) => {
                                    if (disableSave) {
                                        resolve(responses[1]);
                                    } else {
                                        dasherSettings.api.set(responses[1][0].key, responses[1][0].answer).then(() => {
                                            resolve(responses[1][0].answer);
                                        }).catch(() => {
                                            resolve(responses[1][0].answer);
                                        });
                                    }
                                });

                                win.on('window-close', () => {
                                    reject();
                                });

                                win.show();
                            } else {
                                resolve(value);
                            }
                        });
                    }
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

    return dasherSettings;
};
