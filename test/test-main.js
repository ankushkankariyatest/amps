'use strict';

var allTestFiles = [],
  TEST_REGEXP = /(spec|test)\.js$/i;

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

require.config({
    baseUrl: "/base/",
    urlArgs: 'v=1.0',
    paths: {
        'angular': 'assets/libs/angular/angular',
        'angularMocks': 'assets/libs/angular/angular-mocks',
        'angular-route': 'assets/libs/angular/angular-route',
        'angularAMD': 'assets/libs/angular/angularAMD',
        'bootstrap': 'assets/libs/bootstrap/bootstrap.min',
        'ui-bootstrap': 'assets/libs/bootstrap/ui-bootstrap-tpls-0.11.0',
        'ngload': 'assets/libs/angular/ngload',
        'modernizr': 'assets/libs/modernizr-2.6.2',
        'angular-sanitize': 'assets/libs/angular/angular-sanitize',
        'angular-local-storage': 'assets/libs/angular/ngStorage',
        'underscore': 'assets/libs/underscore',
        'pnotify': 'assets/libs/pnotify/pnotify.custom.min',
        'kendo.all.min': 'assets/libs/kendo/kendo.all.min',
        'jszip': 'assets/libs/kendo/jszip.min',
        //'app': 'src/app',

        'validation-util': 'app/modules/common/services/validation-util',
        'storage-factory': 'app/modules/common/services/storage.factory',
        'header-footer': 'app/modules/common/services/header-footer',

        //Auth Specific - Begins
        'auth-constants': 'app/modules/auth/directives/auth.constant',
        'auth-model': 'app/modules/auth/models/auth.model',
        'authentication-factory': 'app/modules/auth/models/auth.factory',
        'auth-service': 'app/modules/auth/services/auth.service',
        'auth-formValidator': 'app/modules/auth/validations/auth.form-validator',

        'bootstrap-popup': 'app/modules/common/services/popup.service',

        'assetIt': 'app/base',
    },
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'angular-sanitize': ['angular'],
        'ui-bootstrap': ['angular']
    },
    deps: allTestFiles,
    callback: window.__karma__.start
});