'use strict';

const remote = require('remote');

const widgets = angular.module('widgets', []);

widgets.directive('templateToolbar', () => {
    return {
        restrict: 'E',
        transclude: true,
        controller: ($scope) => {
            let electronWindow = remote.getCurrentWindow();

            $scope.close = electronWindow.close;
            $scope.minimize = electronWindow.minimize;
            $scope.maximize = electronWindow.maximize;

            $scope.platform = process.platform;
        },
        templateUrl: `../../components/template-toolbar/template-toolbar.html`
    };
});
