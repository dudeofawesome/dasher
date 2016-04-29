const ipcRenderer = require('ipcRenderer');

var ngApp;

var scope;

(function () {
    ngApp = angular.module('dialog', []);

    ngApp.controller('DialogController', ['$scope', function ($scope) {
        $scope.submit = () => {
            alert(JSON.stringify($scope.questions));
            ipcRenderer.send('message', $scope.questions);
        };
        $scope.accept = 'Save';
        scope = $scope;
    }]);
})();
