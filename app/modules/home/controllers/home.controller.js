(function () {
    "use strict";   //'angular-typeahead', 
    define(['assetIt', 'handlebars','homeService', 'angular-typeahead'], function (app, Handlebars) {
        app.register.controller('homeController', ['$scope', 'homeService', 'configOptions',
            function ($scope, homeService, configOptions) {
                $scope.initializeController = function () {
                    $scope.apps = {};
                    $scope.mcps = {};
                    $scope.lobs = {};
                    $scope.searchOptions = {};
                    $scope.appDataset = [];
                    homeService.getAppData(function (multipleRecord) {
                        $scope.count = multipleRecord.count;
                        $scope.apps = multipleRecord.apps;
                        $scope.mcps = multipleRecord.mcps;
                        $scope.lobs = multipleRecord.lobs;
                        initializeTypeahead();
                    });
                   
                };

                var initializeTypeahead = function () {
                    var apps = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.nonword('APP_ID','SERVICE_OR_APPLICATION_NAME', 'IT_SME_BU', 'IT_SME', 'IT_GROUP'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: $scope.apps
                    });
                    var process = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.nonword('DESCRIPTION', 'CODE'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: $scope.mcps
                    });
                    var lobs = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.nonword('LOB_NAME', 'DESCRIPTION'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: $scope.lobs
                    });
                    // initialize the bloodhound suggestion engine
                    apps.initialize();
                    process.initialize();
                    lobs.initialize();
                    //Suggesstion Templates
                    var appTemplate = Handlebars.compile('<p class="repo-name">{{SERVICE_OR_APPLICATION_NAME}}</p><p class="repo-description">App Id: {{APP_ID}} <br /> {{IT_GROUP}} <br /> {{IT_SME}} <br /> {{IT_SME_BU}}</p>');
                    var processTemplate = Handlebars.compile('<p class="repo-name">{{CODE}}</p><p class="repo-description">{{DESCRIPTION}}</p>');
                    var lobsTemplate = Handlebars.compile('<p class="repo-name">{{LOB_NAME}}</p><p class="repo-description">{{DESCRIPTION}}</p>');
                    //Datasets
                    $scope.searchOptions = {};
                    $scope.appDataset = [{
                            name: 'apps',
                            displayKey: 'SERVICE_OR_APPLICATION_NAME',
                            source: apps.ttAdapter(),
                            templates: {
                                suggestion: appTemplate,
                                header : '<p class="auto-search-header">Application</p>'
                            }
                        }, {
                            name: 'mcps',
                            displayKey: 'CODE',
                            source: process.ttAdapter(),
                            templates: {
                                suggestion: processTemplate,
                                header: '<p class="auto-search-header">Process</p>'
                            }
                        }, {
                            name: 'lobs',
                            displayKey: 'LOB_NAME',
                            source: lobs.ttAdapter(),
                            templates: {
                                suggestion: lobsTemplate,
                                header: '<p class="auto-search-header">LOB</p>'
                            }
                        }
                    ];
                    $scope.homeSearch = null;
                }
            }]);
    });
})();