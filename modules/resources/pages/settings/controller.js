var settings;

settings = angular.module('settings', ['widgets']);

settings.controller('SettingsController', () => {
    let ctrlSettings = {};

    ctrlSettings.platform = process.platform;

    return ctrlSettings;
});
