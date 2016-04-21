'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
var spawn;
var sass;

var electron;
gulp.task('start-electron', () => {
    if (!spawn) {
        spawn = require('child_process').spawn;
    }
    if (electron) {
        electron.kill(0);
    }

    electron = spawn(`${__dirname}/node_modules/.bin/electron`, [`${__dirname}/main.js`]);
    electron.stdout.on('data', (data) => {
        process.stdout.write(data.toString());
    });
    electron.on('error', (err) => {
        console.error(err);
    });
});

gulp.task('sass', function () {
    if (!sass) {
        sass = require('gulp-sass');
    }
    return gulp.src('modules/resources/*/*/*.scss')
        .pipe(sass().on('error', function (err) {
            var msg = '';
            var lines = err.messageFormatted.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (i > 0) {
                    msg += chalk.red(lines[i]);
                } else {
                    msg += lines[i];
                }
                if (i + 1 < lines.length) {
                    msg += '\n';
                }
            }
            console.log(msg);
        }))
        .pipe(gulp.dest('modules/resources/'));
});

gulp.task('watch', () => {
    gulp.watch(['main.js', 'modules/*.js'], ['start-electron']);
    gulp.watch(['modules/resources/*/*/*.scss'], ['sass']);
});

gulp.task('dev', ['default', 'watch']);

gulp.task('default', ['sass', 'start-electron']);

process.on('exit', () => {
    console.log('Killing electron?');
    if (electron) {
        electron.kill(0);
    }
});

process.on('beforeExit', () => {
    console.log('Killing electron??');
    if (electron) {
        electron.kill(0);
    }
});
