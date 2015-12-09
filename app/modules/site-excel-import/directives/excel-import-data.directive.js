/**
 * Created by wizdev on 8/6/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'kendo-plugin', 'site-excel-import-services', 'site-excel-import-model'], function (app) {
        app.register.controller("excelImportDataController", ["$scope", 'siteExcelImportService', 'siteExcelImportModelGridConfigs',
            function ($scope, siteExcelImportService, siteExcelImportModelGridConfigs) {
                var excelImportDataCtrl = this;
                $scope.importDataConfig = siteExcelImportModelGridConfigs.getImportDataConfig();
                siteExcelImportService.getLogRecords($scope.startTime).then(function(data) {
                    $scope.importDataConfig.updateGrid(data);
                });
            }]);
        app.register.directive('excelImportData', function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/site-excel-import/templates/excel-tabs/excel-import-data.html',
                scope:{
                    startTime:'='
                },
                controller: "excelImportDataController",
                controllerAs: "excelImportDataCtrl",
                link: function ($scope, element, attr) {

                }
            };
        });
    });
})();