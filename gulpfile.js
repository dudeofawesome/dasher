var gulp = require('gulp');
var spawn;

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
