(function () {
    "use strict";
    define(['assetIt', 'certificationList-service', 'app-config', 'certificationList-config', 'filter-options', 'kendo-plugin'], function (app) {
        app.register.controller('certificationListController', ['$scope', '$rootScope', '$q', '$compile', 'certificationListService', 'appConfig', 'certificationListConfig', 'appConstantPath', 'popupService',
            function ($scope, $rootScope, $q, $compile, certificationListService, appConfig, certificationListConfig, appConstantPath, popupService) {
                $scope.initializeController = function () {
                    var prevStage;
                    var _appConfigs = certificationListConfig.getConfigs();
                    $scope.config = _appConfigs;
                    certificationListService.getCertifications().then(function (resp) {
                        if(resp.isSuccess){
                            _.each(resp.response, function(resp, idx) {
                                resp['createdOnStr'] = kendo.toString(new Date(resp['createdOn']), "F"); // Format Date Object to be search and export friendly
                                resp['statusStr'] = resp['status'] == '1' ? 'Certified': 'Rejected'; // Format Status Object to be search and export friendly
                            });
                            $scope.config.updateGrid(resp.response);
                        }
                    });
                };
                $scope.filterGridRecord = function (text) {
                    var _appConfigs = certificationListConfig.getConfigs();
                    $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
                };
                $("div.gridRequiredClass").on('click', 'span.appBacr', function (e) {
                    var _rowInfo = $("#grid").data("kendoGrid").dataItem($(this).closest("tr"));
                    appConfig.clearApplication();
                    var object = {
                        version:_rowInfo.version,
                        context: _rowInfo.context,
                        identifier: _rowInfo.identifier
                    };
                    certificationListService.getCertifyAppData(object).then(function(resp) {
                        var appData  = resp.response.recordData;
                        appData['comment'] = resp.response.comment;
                        appData['oldData'] = true;
                        appConfig.setApplication(appData);
                        var deferred = $q.defer();
                        require([appConstantPath.application.applicationSystemInfoControllerUrl], function () {
                            $rootScope.$apply(function () {
                                deferred.resolve(popupService.showApplicationBacrPopup(appConstantPath.application.bacrTemplateUrl));
                            });
                        });
                        return deferred.promise;
                    });
                });
            }]);
    });
})();