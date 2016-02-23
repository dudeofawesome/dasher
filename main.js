var electron = require('electron');

module.exports = {
    init: function (callback) {
        module.exports.app = electron.app;

        module.exports.app.on('ready', function() {
            if (callback) {
                callback();
            }
        });
    },
    start: function (callback) {
        module.exports.app.dock.hide();
        console.log('loading');
        var win = new electron.BrowserWindow({
            width: 100,
            height: 100,
            transparent: true,
            show: false,
            frame: false,
            hasShadow: false
        });
        win.loadURL('http://127.0.0.1:41416');
        win.maximize();
        win.setResizable(false);
        win.setMovable(false);
        win.setFullScreenable(false);
        win.setMinimizable(false);
        win.setClosable(false);
        win.setVisibleOnAllWorkspaces(true);
        win.setIgnoreMouseEvents(true);
        win.setSkipTaskbar(true);
        win.show();

        if (callback) {
            callback();
        }
    },
    stop: function (callback) {
        if (callback) {
            callback();
        }
    }
};

module.exports.init(function () {
    module.exports.start();
});
