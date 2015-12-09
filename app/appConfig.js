/// <reference path=".js" />
/// <reference path=".js" />
/// <reference path="modules/cyber-systems/services/cyber-systems.service.js" />
define('jquery', [], function() {
    return jQuery;
});
require.config({
    baseUrl: "app/",
    urlArgs: 'v=1.0',
    waitSeconds: 200,
    // alias libraries paths
    paths: {
        'assetIt': 'base',
      //  'jquery': '../assets/libs/jquery/jquery.min', //'../assets/libs/jquery/jquery-1.9.1.min',
        'angular': '../assets/libs/angular/angular.min',
        'angular-route': '../assets/libs/angular/angular-route.min',
        'angularAMD': '../assets/libs/angular/angularAMD.min',
        'bootstrap': '../assets/libs/bootstrap/bootstrap',
        'ui-bootstrap': '../assets/libs/bootstrap/ui-bootstrap-tpls-0.11.0.min',
        'ngload': '../assets/libs/angular/ngload',
        'modernizr': '../assets/libs/modernizr-2.6.2.min',
        'angular-sanitize': '../assets/libs/angular/angular-sanitize.min',
        'angular-local-storage': '../assets/libs/angular/ngStorage.min',
        'underscore': '../assets/libs/underscore.min',
        'pnotify': '../assets/libs/pnotify/pnotify.custom.min',
        'kendo.all.min': '../assets/libs/kendo/kendo.all.min',
        'pako_deflate':'../assets/libs/kendo/pako_deflate.min',
        'jszip': '../assets/libs/kendo/jszip.min',

        'export-util': 'modules/common/grid-specific/export',
        'filter-options': 'modules/common/directives/assetIt-filter-options.directive',
        'json-comparor':'modules/common/directives/json-comparor',

        'jqHighlight': '../assets/libs/jquery/jquery.highlight',
        'typeahead': '../assets/libs/typeahead.bundle.min',
        'handlebars': '../assets/libs/handlebars.min',
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

        //Utility Module
        'site-utility-module-services':'modules/site-utility-module/services/site-utility-module.service',
        'utility-model-grid-configs': 'modules/site-utility-module/models/site-utility-module.model',
        'site-general-details-directive': 'modules/site-utility-module/directives/site-general-details.directive',

        //Import Excel Module
        'site-excel-import-services':'modules/site-excel-import/services/site-excel-import.service',
        'site-excel-import-model':'modules/site-excel-import/models/site-excel-import.model',

        //Splash Confguration
        'splash-configuration-services':'modules/splash-configuration/services/splash-configuration.service',
        'splash-configuration-model':'modules/splash-configuration/models/splash-configuration.model',

        //version control service
        'kendo-plugin': 'modules/common/grid-specific/kendo-plugin',
        'common-Service': 'modules/common/services/app-common.service',
        'grid-grouping':'modules/common/grid-grouping/grid-grouping.directive',
        'grid-filtering':'modules/common/grid-filtering/grid-filtering.directive',

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
        //Certification List
        'certificationList-config': 'modules/certificationList/models/certification.model',
        'certificationList-service': 'modules/certificationList/services/certification.service',
        //ticket service
        'ticket-service': 'modules/common/services/ticket.service',
        // Excel Import Utility
        'shim2' : '../assets/libs/excel-utils/shim',
        'cpexcel': '../assets/libs/excel-utils/cpexcel',
        'xls' : '../assets/libs/excel-utils/xls',
        'jszipForExcel' : '../assets/libs/excel-utils/jszip',
        'xlsx' : '../assets/libs/excel-utils/xlsx',
        'dropsheet' : '../assets/libs/excel-utils/dropsheet',
        //'shim' : '../assets/libs/excel-utils/shim.js'
        'version-compare-directive':'modules/site-utility-version-diff/directives/version-compare.directive',
        'versionService':'modules/site-utility-version-diff/services/version-compare.service',
        'jsondiffpatch':'../assets/libs/json-diff-patch/jsondiffpatch.min',
        'jsondiffpatch-formatters':'../assets/libs/json-diff-patch/jsondiffpatch-formatters.min',
        'angularjs-dropdown-multiselect': '../assets/libs/angular/angularjs-dropdown-multiselect',
        'jquery-ui.min': '../assets/libs/jquery/jquery-ui.min',
        'angular-dragdrop': '../assets/libs/angular/angular-dragdrop.min',

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
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'blockUI': ['angular'],
        'angular-sanitize': ['angular'],
        'bootstrap': ['jquery'],
        'ui-bootstrap': ['angular'],
        'modernizr': ['angular'],
        'kendo.all.min': {
            deps: ["jquery", "jqHighlight", "jszip", 'angular'],
            exports: "kendo.all.min"
        },
       'cpexcel' :{
           deps: ['shim2', 'xls', 'jszipForExcel', 'xlsx', 'dropsheet'],
           exports: "cpexcel"
        },
        commonPlugins:{
            deps:['grid-grouping', 'grid-filtering'],
            exports: "commonPlugins"
        },
        'typeahead': ['jquery','handlebars'],
        'jsondiffpatch-formatters': {
            deps: ['jsondiffpatch'],
            exports: 'jsondiffpatch.formatters'
        },
        'jsondiffpatch': {
            exports: 'jsondiffpatch'
        }

    },
    // kick start application
    deps: ['assetIt']
});