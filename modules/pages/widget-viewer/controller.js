var widgetLoader = require('../../widget-loader');

var dasher;
var widgets;

widgets = angular.module('widgets', []);

dasher = angular.module('dasher', ['widgets']);

dasher.controller('DasherController', function () {
    var ctrlDasher = {};

    ctrlDasher.test = 'YES!';
    ctrlDasher.widgets = widgetLoader.loadedWidgets;
    console.log(ctrlDasher.widgets);

    return ctrlDasher;
});

widgetLoader.init().then(() => {
    widgetLoader.start().then(() => {
        widgetLoader.loadedWidgets.forEach((widget) => {
            console.log(widget);
            widgets.directive(widget.name, () => {
                return widget;
            });

            let widgetTag = document.createElement(widget.name);
            document.body.appendChild(widgetTag);
        });

        console.log(widgets);

    });
});
