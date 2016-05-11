const electron = require('electron');

var ngApp;

var scope;

(function () {
    ngApp = angular.module('dialog', []);

    ngApp.controller('DialogController', ['$scope', function ($scope) {
        $scope.submit = () => {
            electron.ipcRenderer.send('empty-response', $scope.questions);
            window.close();
        };
        $scope.accept = 'Save';
        scope = $scope;
    }]);
})();
