/**
 * Created by wizdev on 8/6/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'kendo-plugin', 'site-excel-import-services', 'site-excel-import-model', 'site-general-details-directive', 'export-util'], function (app) {
        app.register.controller("excelImportExceptionController", ["$scope", '$rootScope', 'siteExcelImportService', 'siteExcelImportModelGridConfigs', '$compile', 'exportUtil',
            function ($scope, $rootScope, siteExcelImportService, siteExcelImportModelGridConfigs, $compile, exportUtil) {
                var excelImportExceptionCtrl = this;
                $scope.exceptionDataConfig = siteExcelImportModelGridConfigs.getExceptionDataConfig();
                $scope.exceptionDataConfig.detailTemplate = kendo.template($("#exceptionTemplate").html());
                $scope.isSafari = $rootScope.isSafari;
                $scope.exceptionDataConfig.detailInit = function(e) {
                    var detailRow = e.detailRow;
                    var tabStrip = detailRow.find(".detailtabstrip").kendoTabStrip({
                        animation: {
                            open: { effects: "fadeIn" }
                        },
                        select: function (event) {
                            var _model = {};
                            _model['cols'] = dataElement.cols;
                            _model['generalItem'] = e.data;
                            _model['groupsData'] = [{groupName: 'General', dataObject: _.keys(e.data)}];
                            $scope.data = _model;
                            $compile(event.contentElement)($scope);
                        }
                    }).data("kendoTabStrip");

                    tabStrip.select(0);
                };
                var dataElement = _.find($scope.exceptionData, {'_id': $scope.key});
                siteExcelImportService.getExceptionRecords($scope.startTime).then(function(data) {
                    $scope.exceptionDataConfig.refreshGrid(dataElement.primaryKeys);
                    $scope.exceptionDataConfig.updateGrid(dataElement.data);
                });
                $scope.exportGridExcel = function () {
                    // Find the current active tab
                    var dataElement = _.find($scope.exceptionData, {'_id': $scope.key});
                    var detailRow = dataElement['detailRow'];
                    var ts = detailRow.find(".tabstrip").data("kendoTabStrip");
                    var tab = ts.select();
                    // Find the content element of the current active tab
                    var contentElement = $(ts.contentElement(tab.index()));
                    // Find KENDO Grid inside the current active tab
                    var excelGrid = contentElement.find('#exceptionDataGrid').data("kendoGrid");
                    var optionsExcel = {
                        allPages: true
                    };
                    exportUtil.exportToExcel(excelGrid, optionsExcel);
                }
            }]);
        app.register.directive('excelImportException', function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/site-excel-import/templates/excel-tabs/excel-import-exception.html',
                scope:{
                    exceptionData:'=',
                    key:'@',
                    startTime: '='
                },
                controller: "excelImportExceptionController",
                controllerAs: "excelImportExceptionCtrl",
                link: function ($scope, element, attr) {

                }
            };
        });
    });
})();