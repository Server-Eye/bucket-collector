var gulp = require('gulp');
var del = require('del');
var electron = require('gulp-electron');
var install = require('gulp-install');
var packageJson = require('./src/package.json');

gulp.task('electron', ['clean', 'install'], function() {

    gulp.src("")
    .pipe(electron({
        src: './src',
        packageJson: packageJson,
        release: './release',
        cache: './cache',
        version: 'v0.37.4',
        packaging: false,
        platforms: ['win32-ia32', 'darwin-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: 'se-icon.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'se-icon.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('clean-settings', function(){
    return del([
        'src/reaction-data',
        'src/bucket-data'
    ]);
});

gulp.task('clean',['clean-settings'], function(){
    return del([
        'src/node_modules',
        'src/bower_components',
        'release',
        'cache'
    ]);
});

gulp.task('install', function(){
    return gulp.src([
        './src/package.json'
    ]).pipe(install());
});