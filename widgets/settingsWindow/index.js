'use strict';

module.exports = ['$dasherSettings', ($dasherSettings) => {
    let settingsWindow = {
        name: 'settingsWindow',
        restrict: 'E',
        transclude: true,
        scope: {},
        styles: 'style.scss',
        controller: ($scope, $element) => {
            $dasherSettings.get('demoSetting').then((setting) => {
                $scope.demoSettings = setting;
            });
        },
        templateUrl: `template.html`
    };

    return settingsWindow;
}];
