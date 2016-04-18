'use strict';

const clipboard = require('electron').clipboard;

module.exports = {
    name: 'epochTime',
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope, $element) {
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = `${__dirname}/style.css`;
        $element.append(style);

        $scope.time = Math.round(Date.now() / 1000);
        let msToNextSec = 1000 - (new Date()).getMilliseconds();
        setTimeout(() => {
            setInterval(() => {
                $scope.time = Math.round(Date.now() / 1000);
                $scope.$apply();
            }, 1000);
        }, msToNextSec);

        $element.on('click', () => {
            clipboard.writeText(`${Math.round(Date.now() / 1000)}`);
        })
    },
    templateUrl: `${__dirname}/template.html`
};
