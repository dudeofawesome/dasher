var gulp = require('gulp');
var fork;

var electron;
gulp.task('start-electron', () => {
    if (!fork) {
        fork = require('child_process').fork;
    }
    if (electron) {
        electron.kill(0);
    }

    console.log(`${__dirname}/node_modules/.bin/electron`, `${__dirname}/main.js`);
    electron = fork(`${__dirname}/node_modules/.bin/electron`, [`${__dirname}/main.js`]);
});

gulp.task('watch', () => {
    gulp.src(['main.js', 'modules/**.js'], ['start-electron']);
});

gulp.task('dev', ['default', 'watch']);

gulp.task('default', ['start-electron']);

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
