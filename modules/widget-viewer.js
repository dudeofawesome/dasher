'use strict';

const log = require('book');

module.exports = (electron) => {
    let widgetViewer = {
        app: undefined,
        window: undefined,
        tray: undefined,
        trayMenu: [
            {label: 'About Dasher', click: () => {
                electron.shell.openExternal('https://github.com/dudeofawesome/dasher/');
            }},
            {type: 'separator'},
            {label: 'View Widget Gallery', click: () => {
                // electron.shell.showItemInFolder();
            }},
            {label: 'Open Widgets Folder', click: () => {
                // electron.shell.showItemInFolder();
            }},
            {type: 'separator'},
            {label: 'Show Debug Console', click: () => {
                widgetViewer.window.webContents.openDevTools({detach: true});
            }},
            {type: 'separator'},
            {label: 'Quit', click: () => {
                widgetViewer.app.quit();
            }}
        ],

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
                widgetViewer.window = new electron.BrowserWindow({
                    width: size.width,
                    height: size.height,
                    transparent: true,
                    show: false,
                    frame: false,
                    hasShadow: false,
                    type: 'desktop'
                });
                widgetViewer.window.loadURL(`file://${__dirname}/resources/pages/widget-viewer/widget-viewer.html`);
                widgetViewer.window.maximize();
                widgetViewer.window.setResizable(false);
                widgetViewer.window.setMovable(false);
                widgetViewer.window.setFullScreenable(false);
                widgetViewer.window.setMinimizable(false);
                // widgetViewer.window.setClosable(false);
                widgetViewer.window.setVisibleOnAllWorkspaces(true);
                widgetViewer.window.setIgnoreMouseEvents(true);
                widgetViewer.window.setSkipTaskbar(true);
                widgetViewer.window.show();

                var image = electron.nativeImage.createFromPath(`${__dirname}/resources/images/IconTemplate.png`);
                widgetViewer.tray = new electron.Tray(image);
                widgetViewer.tray.setContextMenu(electron.Menu.buildFromTemplate(widgetViewer.trayMenu));

                widgetViewer.window.on('closed', () => {
                    widgetViewer.window = undefined;
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
