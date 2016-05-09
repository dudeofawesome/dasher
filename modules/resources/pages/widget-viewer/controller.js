'use strict';

var widgetLoader = require('../../../widget-loader');

var dasher;
var widgets;

var sass;

widgets = angular.module('widgets', []);

dasher = angular.module('dasher', ['widgets']);

dasher.config(['$compileProvider', ($compileProvider) => {
    dasher.compileProvider = $compileProvider;
}]);

dasher.controller('DasherController', ['$document', '$rootScope', '$compile', '$http', ($document, $rootScope, $compile, $http) => {
    var ctrlDasher = {};

    ctrlDasher.test = 'YES!';
    ctrlDasher.widgets = widgetLoader.loadedWidgets;

    var snakeCase = (string) => {
        var SNAKE_CASE_REGEXP = /[A-Z]/g;
        let separator = '-';
        return string.replace(SNAKE_CASE_REGEXP, (letter, pos) => {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    };

    sass = new Sass('../bower_components/sass.js/dist/sass.worker.js');

    widgetLoader.init().then(() => {
        widgetLoader.start().then(() => {
            widgetLoader.loadedWidgets.forEach((widget) => {

                if (widget.styles) {
                    if (!Array.isArray(widget.styles)) {
                        widget.styles = [widget.styles];
                    }
                    widget.styles.forEach((style) => {
                        let styleSplit = style.split('.');
                        if (styleSplit[styleSplit.length - 1].toLowerCase() === 'css') {
                            var styleEl = document.createElement('link');
                            styleEl.id = widget.name;
                            styleEl.rel = 'stylesheet';
                            styleEl.type = 'text/css';
                            styleEl.href = `${widget.path}/${style}`;
                            document.body.appendChild(styleEl);
                        } else if (styleSplit[styleSplit.length - 1].toLowerCase() === 'scss') {
                            $http({method: 'GET', url: `${widget.path}/${style}`}).then(function successCallback (res) {
                                sass.compile(res.data, (css) => {
                                    var styleEl = document.createElement('style');
                                    styleEl.id = widget.name;
                                    styleEl.innerHTML = css.text;
                                    document.body.appendChild(styleEl);
                                });
                            });
                        }
                    });
                }

                dasher.compileProvider.directive(widget.name, () => {
                    return widget;
                });

                $rootScope.$apply(() => {
                    let widgetTag = $compile(`<${snakeCase(widget.name)}></${snakeCase(widget.name)}>`)($rootScope);
                    document.body.appendChild(widgetTag[0]);
                });
            });

        });
    });

    return ctrlDasher;
}]);
