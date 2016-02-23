var gulp = require('gulp');
var exec;

gulp.task('start-electron', function () {
    if (!exec) {
        exec = require('child_process').exec;
    }

    console.log(__dirname + '/node_modules/.bin/electron ' + __dirname + '/main.js');
    exec(__dirname + '/node_modules/.bin/electron ' + __dirname + '/main.js');
});

gulp.task('default', ['start-electron']);
