/// <reference path="../.js" />
/// <reference path="../" />
module.exports = function (config) {
    config.set({
        //  root path location that will be used to resolve all relative paths in files and exclude sections, should be the root of your project
        basePath: '../',

        // files to include, ordered by dependencies
        files: [
          // include relevant Angular files and libs
          'assets/libs/jquery/jquery.min.js',
          "assets/libs/require.js",
           'assets/libs/angular/angular.js',
          'assets/libs/angular/angular-mocks.js',

        { pattern: 'assets/libs/*.js', included: false }, //DO NOT CHANGE THE FILE ORDER! // include js files
        { pattern: 'assets/libs/**/*.js', included: false }, //DO NOT CHANGE THE FILE ORDER! // include js files
        { pattern: 'app/*.js', included: false },// include application files
        { pattern: 'app/modules/**/**/*.js', included: false },// include application files,
        {
            pattern: 'config.json', included: false, watched: true, served: true
        },// include application files
        {
            pattern: 'test/unit/**/**/*.spec.js', included: false
        },// include unit test specs
          'test/test-main.js'
        ],
        // files to exclude
        exclude: [],//'app/appConfig.js'

        // karma has its own autoWatch feature but Grunt watch can also do this
        autoWatch: false,

        // testing framework, be sure to install the karma plugin
        frameworks: ['jasmine'], //, 'requirejs'

        // browsers to test against, be sure to install the correct karma browser launcher plugin
        browsers: ['Chrome'], // , 'Firefox', 'PhantomJS'

        // progress is the default reporter
        reporters: ['progress', 'coverage'],

        // map of preprocessors that is used mostly for plugins
        preprocessors: {
            'app/modules/**/templates/*.html': 'html2js',
            'app/modules/**/templates/**/*.html': 'html2js',
            '*.json': ['html2js'],
            '**/*.json': ['html2js']
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // web server port
        port: 9876,
        // cli runner port
        runnerPort: 9100,
        // list of karma plugins
        proxies: {
            '/config.json': 'http://localhost:9876/config.json',
            '/config.json': 'http://localhost:9876/config.json',
            '/base/config.json': 'http://localhost:9876/config.json'
        },

        // list of karma plugins
        plugins: [
        //'karma-junit-reporter',
                 'karma-jshint-preprocessor',
                'karma-coverage',
                'karma-chrome-launcher',
                'karma-firefox-launcher',
                'karma-jasmine',
                'karma-ng-html2js-preprocessor'
                //'karma-requirejs'
            //,'karma-phantomjs-launcher'
        ],
        // plugin settings 
        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
        },
        coverageReporter: {
            // type of file to output, use text to output to console 
            type: 'text',
            // directory where coverage results are saved 
            dir: 'test/result/coverage/'
            // if type is text or text-summary, you can set the file name 
            // file: 'coverage.txt'  
        },
        junitReporter: {
            outputFile: 'test/result/results.xml'
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
}