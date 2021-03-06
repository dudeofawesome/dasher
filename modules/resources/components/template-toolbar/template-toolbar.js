'use strict';

const remote = require('remote');

const UIwidgets = angular.module('UIwidgets', []);

UIwidgets.directive('templateToolbar', () => {
    return {
        restrict: 'E',
        transclude: true,
        controller: ($scope) => {
            let electronWindow = remote.getCurrentWindow();

            $scope.platform = process.platform;

            $scope.close = electronWindow.close;
            $scope.minimize = electronWindow.minimize;
            $scope.maximize = electronWindow.maximize;

            electronWindow.on('enter-full-screen', () => {
                $scope.fullscreen = electronWindow.isFullScreen();
                $scope.$apply();
            });
            electronWindow.on('leave-full-screen', () => {
                $scope.fullscreen = electronWindow.isFullScreen();
                $scope.$apply();
            });

            $scope.fullscreen = electronWindow.isFullScreen();

            $scope.title = document.title;
        },
        templateUrl: `../../components/template-toolbar/template-toolbar.html`
    };
});
