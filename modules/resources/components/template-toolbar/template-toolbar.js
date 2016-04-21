'use strict';

const remote = require('remote');

const widgets = angular.module('widgets', []);

widgets.directive('templateToolbar', () => {
    return {
        restrict: 'E',
        transclude: true,
        controller: ($scope) => {
            let electronWindow = remote.getCurrentWindow();

            $scope.platform = process.platform;

            $scope.close = electronWindow.close;
            $scope.minimize = electronWindow.minimize;
            let darwinMaximize = (ev) => {
                if (ev && ev.altKey) {
                    electronWindow.maximize();
                } else {
                    electronWindow.setFullScreen(!electronWindow.isFullScreen());
                }
            };
            $scope.maximize = $scope.platform === 'darwin' ? darwinMaximize : electronWindow.maximize;
        },
        templateUrl: `../../components/template-toolbar/template-toolbar.html`
    };
});
