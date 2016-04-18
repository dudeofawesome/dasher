var widgetLoader = require('../../../widget-loader');

var dasher;
var widgets;

widgets = angular.module('widgets', []);

dasher = angular.module('dasher', ['widgets']);

dasher.config(['$compileProvider', ($compileProvider) => {
    dasher.compileProvider = $compileProvider;
}]);

dasher.controller('DasherController', ['$document', '$rootScope', '$compile', ($document, $rootScope, $compile) => {
    var ctrlDasher = {};

    ctrlDasher.test = 'YES!';
    ctrlDasher.widgets = widgetLoader.loadedWidgets;
    console.log(ctrlDasher.widgets);

    var snakeCase = (string) => {
        var SNAKE_CASE_REGEXP = /[A-Z]/g;
        let separator = '-';
        return string.replace(SNAKE_CASE_REGEXP, (letter, pos) => {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    };

    widgetLoader.init().then(() => {
        widgetLoader.start().then(() => {
            widgetLoader.loadedWidgets.forEach((widget) => {
                console.log(widget);

                dasher.compileProvider.directive(widget.name, () => {
                    return widget;
                });

                $rootScope.$apply(() => {
                    // let widgetTag = document.createElement(widget.name);
                    let widgetTag = $compile(`<${snakeCase(widget.name)}></${snakeCase(widget.name)}>`)($rootScope);
                    document.body.appendChild(widgetTag[0]);
                    // $document.append(widgetTag);
                    console.log('OH YEAH');
                });
            });

            console.log(widgets);
        });
    });

    return ctrlDasher;
}]);
