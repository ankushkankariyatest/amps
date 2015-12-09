/**
 * Created by wizdev on 8/6/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'kendo-plugin', 'site-excel-import-services', 'site-excel-import-model'], function (app) {
        app.register.controller("excelImportDetailsController", ["$scope", 'siteExcelImportService', 'siteExcelImportModelGridConfigs',
            function ($scope, siteExcelImportService, siteExcelImportModelGridConfigs) {
                var excelImportDetailsCtrl = this;
                $scope.importDetailConfig = siteExcelImportModelGridConfigs.getImportDetailConfig();
                siteExcelImportService.getLogDetails($scope.startTime).then(function(data) {
                    $scope.importDetailConfig.updateGrid(data);
                });
            }]);
        app.register.directive('excelImportDetails', function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/site-excel-import/templates/excel-tabs/excel-import-details.html',
                scope:{
                    startTime:'='
                },
                controller: "excelImportDetailsController",
                controllerAs: "excelImportDetailsCtrl",
                link: function ($scope, element, attr) {

                }
            };
        });
    });
})();