var scope;

(function () {
    const electron = require('electron');

    var settings;

    settings = angular.module('settings', ['widgets']);

    settings.controller('SettingsController', ['$scope', ($scope) => {
        $scope.platform = process.platform;

        $scope.submit = () => {
            electron.ipcRenderer.send('empty-response', $scope.questions);
            window.close();
        };
        $scope.accept = 'Save';
        scope = $scope;
    }]);
})();
