
module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    var gruntConfig = grunt.file.readJSON('Gruntconfig.json');
    var annotateFiles = {};
    for(var i in gruntConfig.filePaths) {
        annotateFiles[gruntConfig.filePaths[i]]=gruntConfig.filePaths[i];
    }
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cvars: gruntConfig.configVars,
        copy: {
            default: {
                files: [
                    {
                        cwd: '<%= cvars.app %>/', expand: true,
                        dest: '<%= cvars.dist %>/',
                        src: ['<%= cvars.assets %>/fonts/**','<%= cvars.assets %>/fonts/**','<%= cvars.assets %>/images/**','<%= cvars.assets %>/libs/**','config.json']
                    },
                    {
                        cwd: '<%= cvars.app %>/', expand: true,
                        dest: '<%= cvars.build %>/',
                        src: ['<%= cvars.appjs %>/**']
                    },
                    {
                        cwd: '<%= cvars.app %>/', expand: true,
                        dest: '<%= cvars.dist %>/',
                        src: ['<%= cvars.assets %>/css/kendo/**']
                    }
                ]
            }
        },
        cssmin: {
            default: {
                files: {
                    '<%= cvars.dist %>/<%= cvars.css %>/main.css': [
                        '<%= cvars.css %>/kendo/kendo.common.min.css',
                        '<%= cvars.css %>/kendo/kendo.bootstrap.min.css',
                        '<%= cvars.css %>/bootstrap.min.css',
                        '<%= cvars.css %>/pnotify/pnotify.custom.min.css',
                        '<%= cvars.css %>/assetIT-custom.css',
                        '<%= cvars.css %>/structure/assetIT-layouts.css',
                        '<%= cvars.css %>/structure/assetIT-navigation.css',
                        '<%= cvars.css %>/structure/assetIT-popups.css',
                        '<%= cvars.css %>/structure/assetIT-login.css',
                        '<%= cvars.css %>/assetIT-header.css',
                        '<%= cvars.css %>/structure/assetIT-responsive.css',
                        '<%= cvars.css %>/assetIT-footer.css',
                        '<%= cvars.css %>/error.css',
                        '<%= cvars.css %>/autosuggestion.css'
                    ]
                }
            }
        },
        htmlmin: {
            default: {
                options: {
                    removeComments: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: false,
                    removeEmptyElements: false
                },
                files: [
                    { '<%= cvars.dist %>/index.html': '<%= cvars.app %>/index.html' },
                    {
                        cwd: '<%= cvars.app %>/', expand: true, flatten: false,
                        dest: '<%= cvars.app %>/',
                        src: '<%= cvars.build %>/**/*.html'
                    }
                ]
            }
        },
        ngAnnotate: {
            options: {
                ngAnnotateOptions: {},
                singleQuotes: true,
            },
            default: {
                files: [
                    {
                        expand: true,
                        src: gruntConfig.filePaths,
                        ext: ".js",
                        extDot: 'last'

                    }
                ]
            },
        },
        'string-replace': {
            default: {
                files: {
                    '<%= cvars.dist %>/<%= cvars.assets %>/css/main.css':'<%= cvars.dist %>/<%= cvars.assets %>/css/main.css'
                },
                options: {
                    replacements: [{
                        pattern: /Bootstrap\//g,
                        replacement: 'kendo/Bootstrap/'
                    },{
                        pattern: /Default\//g,
                        replacement: 'kendo/Default/'
                    },{
                        pattern: /textures\//g,
                        replacement: 'kendo/textures/'
                    },{
                        pattern: /fonts\/DejaVu\//g,
                        replacement: 'kendo/fonts/DejaVu/'
                    }, {
                        pattern: /\.\.\/\.\.\//ig,
                        replacement: '../'
                    }]
                }
            }
        },
        clean:{
            options: {
                'no-write': false
            },
            default: ['<%= cvars.app %>/<%= cvars.build %>/**/*', '<%= cvars.app %>/<%= cvars.build %>']
        },
        requirejs: {
            default: {
                options: {
                    baseUrl: "<%= cvars.build %>/<%= cvars.appjs %>/",
                    urlArgs: 'v=1.0',
                    waitSeconds: 200,
                    fileExclusionRegExp: /^\.\.\/\.\.\/assets/,
                    // alias libraries paths
                    paths: {
                        'assetIt': 'base',
                        //  'jquery': '../assets/libs/jquery/jquery.min', //'../assets/libs/jquery/jquery-1.9.1.min',
                        'angular': 'empty:',
                        'angular-route': 'empty:',
                        'angularAMD': 'empty:',
                        'bootstrap': 'empty:',
                        'ui-bootstrap': 'empty:',
                        'ngload': 'empty:',
                        'modernizr': 'empty:',
                        'angular-sanitize': 'empty:',
                        'angular-local-storage': 'empty:',
                        'underscore': 'empty:',
                        'pnotify': 'empty:',
                        'kendo.all.min': 'empty:',
                        'jszip': 'empty:',
                        'jqHighlight': 'empty:',
                        'typeahead': 'empty:',
                        'handlebars': 'empty:',
                        'export-util': 'modules/common/grid-specific/export',
                        'filter-options': 'modules/common/directives/assetIt-filter-options.directive',
                        'angular-typeahead': 'modules/common/directives/angular-typeahead',
                        'userService': 'modules/user/services/user.service',
                        'ajax-service': 'modules/common/services/ajax.service',
                        'storage-factory': 'modules/common/services/storage.factory',
                        'header-footer': 'modules/common/services/header-footer',
                        'validation-util': 'modules/common/services/validation-util',
                        'notify-service': 'modules/common/services/notify.service',
                        //Auth Specific - Begins
                        'auth-constants': 'modules/auth/directives/auth.constant',
                        'auth-model': 'modules/auth/models/auth.model',
                        'authentication-factory': 'modules/auth/models/auth.factory',
                        'auth-service': 'modules/auth/services/auth.service',
                        'auth-formValidator': 'modules/auth/validations/auth.form-validator',
                        //Feedback required files
                        'bootstrap-popup': 'modules/common/services/popup.service',
                        'feedback-controller': 'modules/feedback/controllers/feedback.controller',
                        'feedback-service': 'modules/feedback/services/feedback.service',
                        'feedback-model': 'modules/feedback/models/feedback.model',
                        'feedback-validation': 'modules/feedback/validations/feedback.validation',
                        'upload-directive': 'modules/feedback/directives/upload.directive',
                        //Process Services
                        'processService': 'modules/process/services/processService',
                        //Lob Services
                        'lobService': 'modules/lobs/services/lobService',
                        //infrastructure-tab
                        'infrastructure-menu-tab': 'modules/infra/directives/infrastructure-tab.directive',
                        'infrastructure-menu-service': 'modules/infra/services/infrastructure.service',
                        'infrastructure-menu-model': 'modules/infra/models/infrastructure.model',

                        'homeService': 'modules/home/services/home.service',
                        //edit user functionality
                        'userModel': 'modules/user/models/user.model',
                        'editUserValidation': 'modules/user/validation/editUser.validation',

                        //MCPS
                        'mcps-config': 'modules/mcps/models/mcps.model',
                        'mcps-service': 'modules/mcps/services/mcps.service',

                        //Lob
                        'lobs-config': 'modules/lobs/models/lobs.model',
                        'lobs-service': 'modules/lobs/services/lobs.service',

                        //Sites
                        'cyber-systems-service': 'modules/cyber-systems/services/cyber-systems.service',
                        'cyber-systems-config': 'modules/cyber-systems/models/cyber-systems.model',

                        'site-utility-module-services':'modules/site-utility-module/services/site-utility-module.service',
                        'utility-model-grid-configs': 'modules/site-utility-module/models/site-utility-module.model',

                        //Import Excel Module
                        'site-excel-import-services':'modules/site-excel-import/services/site-excel-import.service',
                        'site-excel-import-model':'modules/site-excel-import/models/site-excel-import.model',

                        //version control service
                        'kendo-plugin': 'modules/common/grid-specific/kendo-plugin',
                        'common-Service': 'modules/common/services/app-common.service',

                        //Application
                        'applicationService': 'modules/application/services/application.service',
                        'app-config': 'modules/application/models/app.model',
                        'appInfra-model': 'modules/application/models/app-infra.model',
                        'appInfra-service': 'modules/application/services/appInfra.service',
                        'app-infra-tab': 'modules/application/directives/app-infra-tab.directive',
                        'app-infra-wrapper-tab': 'modules/application/directives/app-infra-wrapper-tab.directive',
                        //'appGridDirective': 'modules/application/directives/app.grid.directive',
                        // FeedbackTicket Directive
                        "FeedbackTicket": "modules/common/directives/feedbackTicket",
                        "GlobalFilters": "modules/common/filters/GlobalFilters",
                        'genericTreeView.directive': 'modules/common/directives/genericTreeView.directive',

                        //Feedback List
                        'feedbackList-config': 'modules/feedbackList/models/feedback.model',
                        'feedbackList-service': 'modules/feedbackList/services/feedback.service',
                        'ticket-service': 'modules/common/services/ticket.service',
                        // Excel Import Utility
                        //'shim' : '../assets/libs/excel-utils/shim.js'
                        'version-compare-directive':'modules/site-utility-version-diff/directives/version-compare.directive',
                        'versionService':'modules/site-utility-version-diff/services/version-compare.service',
                        //Splash Confguration

                        'site-history-directive': 'modules/site-utility-module/directives/site-history.directive',
                        'site-version-comparor-directive': 'modules/site-utility-module/directives/site-version-comparor.directive',
                        'excel-import-details-directive': 'modules/site-excel-import/directives/excel-import-details.directive',
                        'excel-import-data-directive': 'modules/site-excel-import/directives/excel-import-data.directive',
                        'excel-import-exception-directive': 'modules/site-excel-import/directives/excel-import-exception.directive',
                        //enterprise-access required files
                        'enterprise-access-controller': 'modules/enterprise-access/controllers/enterprise-access.controller',
                        'enterprise-access-service': 'modules/enterprise-access/services/enterprise-access.service',
                        'enterprise-access-model': 'modules/enterprise-access/models/enterprise-access.model',
                        'enterprise-access-validation': 'modules/enterprise-access/validations/enterprise-access.validation',
                        //audit-logs required files
                        'audit-logs-controller': 'modules/audit-logs/controllers/audit-logs.controller',
                        'audit-logs-service': 'modules/audit-logs/services/audit-logs.service',
                        'audit-logs-model': 'modules/audit-logs/models/audit-logs.model'

                    },
                    dir: "<%= cvars.dist %>/<%= cvars.appjs %>/",
                    modules: [
                        {
                            name: "assetIt",
                            //exclude: ['angularAMD', 'underscore', 'angular-route', 'bootstrap', 'ui-bootstrap', 'bootstrap-popup', 'angular-sanitize']
                        }
                    ],
                    optimize: "uglify2",
                    uglify2: {

                        output: {
                            beautify: false
                        },
                        mangle: {
                            sort: true
                        }
                    },
                    keepBuildDir: true
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.registerTask('default', ['copy', 'ngAnnotate','cssmin', 'htmlmin','requirejs', 'string-replace', 'clean']);

};