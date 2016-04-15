'use strict';

let fs = require('fs-extra-promise');
const os = require('os');
const log = require('book');

let widgetLoader = {
    widgetsFolder: undefined,
    loadedWidgets: [],
    activatedWidgets: [],

    init: function () {
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
    start: function () {
        return new Promise((resolve) => {
            log.info('Starting widget-loader…');

            this.reloadWidgets().then(() => {
                resolve();
            });

        });
    },
    stop: function () {
        return new Promise((resolve) => {
            log.info('Stopping widget-loader…');

            // this.unloadPlugins();

            resolve();
        });
    },

    reloadWidgets: function () {
        return new Promise((resolve) => {
            widgetLoader.activatedPlugins = [];
            log.info('Reloading widgets…');
            var pluginsToLoad = 0;
            var pluginsLoaded = 0;
            function loadPlugins (folder) {
                if (folder === undefined) {
                    folder = widgetLoader.pluginsFolder;
                }
                // TODO: if there are no plugins to load, then 'it never finishes' loading them
                fs.readdir(folder, function (err, files) {
                    pluginsToLoad += files.length;
                    for (var file in files) {
                        (function (_file) {
                            fs.stat(folder + files[_file], function (err, stats) {
                                if (stats.isFile()) {
                                    // TODO: make this more efficient. Maybe just catching an error on a bad require would do it
                                    if (files[_file].split('.').reverse()[0].toLowerCase() === 'js') {
                                        var plugin = require(folder + files[_file])(irisAPI);
                                        widgetLoader.loadedPlugins[plugin.name] = plugin;
                                        GUI.addPlugin(plugin.name);
                                        pluginsLoaded++;
                                        console.log('  ' + plugin.name);
                                        if (pluginsLoaded >= pluginsToLoad) {
                                            widgetLoader.activatedPlugins = activatedPlugins;

                                            resolve();
                                        }
                                    } else {
                                        pluginsToLoad--;
                                    }
                                } else if (stats.isDirectory()) {
                                    pluginsToLoad--;
                                    loadPlugins(folder + files[_file] + '/');
                                }
                            });
                        })(file);
                    }
                });
            }

            fs.access(widgetLoader.pluginsFolder, function (err) {
                if (!err) {
                    loadPlugins();
                } else {
                    log.warn('Could\'t find plugins folder');
                    fs.mkdirp(widgetLoader.pluginsFolder, function () {
                        log.info('Created plugins folder at ' + widgetLoader.pluginsFolder);
                        loadPlugins();
                    });
                }
            });
        });
    },
    reloadPluginsSync: function (callback) {
        widgetLoader.deactivatePlugins();
        console.log('Loading plugins…');
        function loadPlugins (folder) {
            if (folder === undefined) {
                folder = widgetLoader.pluginsFolder;
            }
            // TODO: if there are no plugins to load, then 'it never finishes' loading them
            var files = fs.readdirSync(folder);
            for (var file in files) {
                var stats = fs.statSync(folder + files[file]);
                if (stats.isFile()) {
                    // TODO: make this more efficient. Maybe just catching an error on a bad require would do it
                    if (files[file].split('.').reverse()[0].toLowerCase() === 'js') {
                        var plugin = require(folder + files[file])(irisAPI);
                        widgetLoader.loadedPlugins[plugin.name] = plugin;
                        // GUI.addPlugin(plugin.name);
                        console.log('  ' + plugin.name);
                    }
                } else if (stats.isDirectory()) {
                    loadPlugins(folder + files[file] + '/');
                }
            }
        }

        if (!fs.accessSync(widgetLoader.pluginsFolder)) {
            loadPlugins();
        } else {
            console.log('Could\'t find plugins folder');
            fs.mkdirpSync(widgetLoader.pluginsFolder);
            console.log('Created plugins folder at ' + widgetLoader.pluginsFolder);
            loadPlugins();
        }

        if (callback) {
            callback();
        }
    },
    activatePlugin: function (plugin) {
        if (this.activatedPlugins.indexOf(plugin) === -1) {
            if (this.loadedPlugins[plugin] !== undefined) {
                this.activatedPlugins.push(plugin);
                if (widgetLoader.loadedPlugins[plugin].start) {
                    var leds;
                    if (widgetLoader.loadedPlugins[plugin].colorSpace === 'RGB' || widgetLoader.loadedPlugins[plugin].colorSpace === undefined) {
                        leds = RGBtoHSV(widgetLoader.loadedPlugins[plugin].start(HSVtoRGB(irisAPI.leds)));
                    } else if (widgetLoader.loadedPlugins[plugin].colorSpace === 'HSV') {
                        leds = widgetLoader.loadedPlugins[plugin].start(irisAPI.leds);
                    }
                    if (leds) {
                        irisAPI.leds = leds;
                    }
                }
                console.log('Loaded ' + plugin + ' plugin');
            } else {
                console.log('Plugin not found');
            }
        } else {
            console.log('Plugin already loaded');
        }
    },
    deactivatePlugin: function (plugin) {
        if (this.activatedPlugins.indexOf(plugin) !== -1) {
            this.activatedPlugins.splice(this.activatedPlugins.indexOf(plugin), 1);
            console.log('Unloaded ' + plugin + ' plugin');
            return;
        }
        console.log('Plugin not loaded');
    },
    deactivatePlugins: function () {
        this.activatedPlugins.splice(0, this.activatedPlugins.length - 1);
    }
};

module.exports = widgetLoader;
