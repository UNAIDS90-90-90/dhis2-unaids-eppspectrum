var gulp = require('gulp');
var zip = require('gulp-zip');
var shell = require('gulp-shell');
var argv = require('yargs').argv;
gulp.task('pack', ['build'], function() {
    return gulp.src('dist/**/*').pipe(zip('hivpopdata.zip')).pipe(gulp.dest('target'));
});
gulp.task('deploy', ['pack'], function() {
    var username = argv.username || 'admin';
    var password = argv.password || 'district';
    var url = argv.url || 'http://localhost:8080';

    return gulp.src('target/hivpopdata.zip').pipe(shell(['curl -X DELETE -u ' + username + ':' + password + ' ' + url +
        '/api/apps/hivpopdata', 'curl -X POST -u' + username + ':' + password + ' -F file=@<%= file.path %> ' + url +
        '/api/apps'
    ]));
});
