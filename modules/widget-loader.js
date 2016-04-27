'use strict';

let fs = require('fs-extra-promise');
const os = require('os');
const log = require('book');

const widgetAPI = {
    $dasherSettings: require('./widget-libs/dasher-settings')(require('electron'), require('electron-json-storage'))
};

console.log(widgetAPI);

let widgetLoader = {
    widgetsFolder: undefined,
    loadedWidgets: [],
    activatedWidgets: [],

    init: () => {
        return new Promise((resolve) => {
            log.info('Initializing widget-loader…');

            switch (process.platform) {
                case 'darwin':
                    widgetLoader.widgetsFolder = `${os.homedir()}/Library/Application Support/io.orleans.dasher/widgets`;
                    break;
                case 'win32':
                    widgetLoader.widgetsFolder = `${os.homedir()}/AppData/Local/io.orleans.dasher/widgets`;
                    break;
                default:
                    widgetLoader.widgetsFolder = `${os.homedir()}/usr/local/share/io.orleans.dasher/widgets`;
                    break;
            }

            fs.existsAsync(widgetLoader.widgetsFolder).then((exists) => {
                if (exists) {
                    fs.isDirectoryAsync(widgetLoader.widgetsFolder).then((isDirectory) => {
                        if (isDirectory) {
                            log.debug(`it's a dir!`);
                        } else {
                            log.debug(`it's not a dir 🙁`);
                        }
                        resolve();
                    });
                } else {
                    fs.mkdirpAsync(widgetLoader.widgetsFolder).then(() => {
                        log.info(`Created application settings directory`);
                        resolve();
                    });
                }
            });
        });
    },
    start: () => {
        return new Promise((resolve) => {
            log.info('Starting widget-loader…');

            widgetLoader.reloadWidgets().then(() => {
                resolve();
            });

        });
    },
    stop: () => {
        return new Promise((resolve) => {
            log.info('Stopping widget-loader…');

            // widgetLoader.unloadPlugins();

            resolve();
        });
    },

    reloadWidgets: () => {
        return new Promise((resolve) => {
            widgetLoader.loadedWidgets = [];
            widgetLoader.activatedWidgets = [];
            log.info('Reloading widgets…');
            var pluginsToLoad = 0;
            var pluginsLoaded = 0;
            function loadPlugins (searchFolder) {
                // TODO: if there are no plugins to load, then 'it never finishes' loading them
                log.info(`Looking in ${searchFolder}`);
                fs.readdir(searchFolder, (err, folders) => {
                    pluginsToLoad += folders.length;
                    for (var folder in folders) {
                        log.info(`Trying out ${searchFolder}/${folders[folder]}`);
                        (function (_folder) {
                            fs.stat(`${searchFolder}/${folders[_folder]}`, (err, stats) => {
                                if (stats.isDirectory()) {
                                    var plugin = require(`${searchFolder}/${folders[_folder]}`);
                                    if (Array.isArray(plugin)) {
                                        plugin = widgetLoader.injectWidgetDepencies(plugin);
                                    }
                                    plugin.path = `${searchFolder}/${folders[_folder]}`;
                                    if (plugin.templateUrl) {
                                        plugin.templateUrl = `${searchFolder}/${folders[_folder]}/${plugin.templateUrl}`;
                                    }
                                    widgetLoader.loadedWidgets.push(plugin);
                                    pluginsLoaded++;
                                    log.info('  ' + plugin.name);
                                    if (pluginsLoaded >= pluginsToLoad) {
                                        resolve();
                                    }
                                } else {
                                    pluginsToLoad--;
                                    // loadPlugins(folder + folders[_folder] + '/');
                                }
                            });
                        })(folder);
                    }
                });
            }

            loadPlugins(widgetLoader.widgetsFolder);
        });
    },
    injectWidgetDepencies: (widget) => {
        if (Array.isArray(widget)) {
            let dependencies = [];
            for (let i = 0; i < widget.length - 1; i++) {
                dependencies.push(widgetAPI[widget[i]]);
                if (dependencies[dependencies.length - 1]) {
                    dependencies[dependencies.length - 1] = dependencies[dependencies.length - 1].api;
                }
            }
            let consctructor = widget[widget.length - 1];
            // TODO: figure out a better way to pass the dependency array
            return consctructor(dependencies[0], dependencies[1], dependencies[2], dependencies[3], dependencies[4], dependencies[5]);
        } else {
            return widget();
        }
    }
    // ,
    // activateWidget: function (plugin) {
    //     if (this.activatedPlugins.indexOf(plugin) === -1) {
    //         if (this.loadedPlugins[plugin] !== undefined) {
    //             this.activatedPlugins.push(plugin);
    //             if (widgetLoader.loadedPlugins[plugin].start) {
    //                 var leds;
    //                 if (widgetLoader.loadedPlugins[plugin].colorSpace === 'RGB' || widgetLoader.loadedPlugins[plugin].colorSpace === undefined) {
    //                     leds = RGBtoHSV(widgetLoader.loadedPlugins[plugin].start(HSVtoRGB(irisAPI.leds)));
    //                 } else if (widgetLoader.loadedPlugins[plugin].colorSpace === 'HSV') {
    //                     leds = widgetLoader.loadedPlugins[plugin].start(irisAPI.leds);
    //                 }
    //                 if (leds) {
    //                     irisAPI.leds = leds;
    //                 }
    //             }
    //             console.log('Loaded ' + plugin + ' plugin');
    //         } else {
    //             console.log('Plugin not found');
    //         }
    //     } else {
    //         console.log('Plugin already loaded');
    //     }
    // },
    // deactivateWidget: function (plugin) {
    //     if (this.activatedPlugins.indexOf(plugin) !== -1) {
    //         this.activatedPlugins.splice(this.activatedPlugins.indexOf(plugin), 1);
    //         console.log('Unloaded ' + plugin + ' plugin');
    //         return;
    //     }
    //     console.log('Plugin not loaded');
    // },
    // deactivateWidgets: function () {
    //     this.activatedPlugins.splice(0, this.activatedPlugins.length - 1);
    // }
};

module.exports = widgetLoader;
