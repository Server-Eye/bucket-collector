var gulp = require('gulp');
var del = require('del');
var electron = require('gulp-electron');
var install = require('gulp-install');
var tasks = require('gulp-task-listing');
var beautify = require('gulp-beautify');
var exec = require('child_process').execFile;
var path = require('path');
var packageJson = require('./src/package.json');

var buildOptions = {
    src: './src',
    packageJson: packageJson,
    release: './release',
    cache: './cache',
    version: 'v2.0.3',
    packaging: false,
    platforms: ['win32-ia32'], //, 'darwin-x64'],
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
};

function getReleaseDir(platform) {
    return   "./release/" + buildOptions.version + "/" + platform;
}


gulp.task('default', function () {
    return tasks.withFilters(null, 'default')();
});

gulp.task('prebuild', ['clean', 'install'], function () {
    return gulp.src("")
            .pipe(electron(buildOptions))
            .pipe(gulp.dest(""));
});

gulp.task('build-win', ['prebuild'], function () {
    gulp.src([
        getReleaseDir('win32-ia32') + '/resources/app/templates/**/*.*',
        getReleaseDir('win32-ia32') + '/resources/app/debug/**/*.*'
    ], {
        base: getReleaseDir('win32-ia32') + '/resources/app'
    }).pipe(gulp.dest(getReleaseDir('win32-ia32')));
});

gulp.task('build', ['build-win'], function (cb) {
    cb();
});

gulp.task('clean-settings', function () {
    return del([
        'src/reaction-data',
        'src/bucket-data'
    ]);
});

gulp.task('clean-logs', function () {
    return del([
        'src/logs'
    ]);
});

gulp.task('clean-install', function () {
    return del([
        'src/bower_components',
        'src/node_modules'
    ]);
});

gulp.task('clean-build', function () {
    return del([
        'release',
        'cache'
    ]);
});

gulp.task('clean-docs', function () {
    return del([
        'docs'
    ]);
});

gulp.task('clean-debug', function () {
    return del([
        'src/debug/*', '!src/debug/bucketmessages', '!src/debug/bucketmessages/messages.json'
    ]);
});

gulp.task('clean', ['clean-settings', 'clean-logs', 'clean-install', 'clean-build', 'clean-docs', 'clean-debug', 'beautify'], function (cb) {
    cb();
});

gulp.task('install', function () {
    return gulp.src([
        './src/package.json',
        './src/bower.json'
    ]).pipe(install({
        production: true
    }));
});

gulp.task('install-dev', function () {
    return gulp.src([
        './src/package.json',
        './src/bower.json'
    ]).pipe(install({
        production: false
    }));
});

gulp.task('docs', ['clean-docs'], function (cb) {
    var command = [
        '--source', './src',
        '--output', './docs',
        '--name', 'Server-Eye bucket-collector',
        '--ignore', 'node_modules,bower_components,reaction-data,bucket-data,logs,public'
    ];

    var mrDoc;
    if (process.platform === 'win32') {
        mrDoc = path.resolve('./node_modules/.bin/mr-doc.cmd');
    } else {
        mrDoc = path.resolve('./node_modules/.bin/mr-doc');
    }

    exec(mrDoc, command, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('beautify', ['clean-settings', 'clean-install', 'clean-build', 'clean-docs'], function () {
    return gulp.src([
        './src/**/*.js',
        './src/**/*.json',
        '!src/node_modules/**/*.js',
        '!src/bower_components/**/*.js',
        '!src/node_modules/**/*.json',
        '!src/bower_components/**/*.json'
    ]).pipe(beautify({
        indentSize: 4
    })).pipe(gulp.dest('./src'));
});