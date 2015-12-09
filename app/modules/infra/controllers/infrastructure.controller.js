(function () {
    "use strict";
    define(['assetIt', 'infrastructure-menu-tab', 'infrastructure-menu-model', 'export-util', 'bootstrap-popup', 'FeedbackTicket'], function (app) {
        app.register.controller('infrastructureController', ['$scope', '$compile', 'infrastructureModel', 'exportUtil', 'authenticationFactory','popupService',
            function ($scope,  $compile, infrastructureModel,exportUtil, authenticationFactory, popupService) {
                $scope.userRole = authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.enterprise) > -1;
                $scope.initializeController = function () {
                    var tabs = infrastructureModel.tabsList();
                    $scope.tabStrip = $(".tabstrip").kendoTabStrip({
                        animation: {
                            open: { effects: "fadeIn" }
                        },
                        dataContentUrlField: "contentUrl",
                        dataTextField: "label",
                        dataSource: kendo.data.DataSource.create(tabs),
                        contentLoad: function (e) {
                            $compile(e.contentElement)($scope);
                        },
                        select: function (e) {
                            $compile(e.contentElement)($scope);
                        }
                    }).data("kendoTabStrip");

                    $scope.tabStrip.select(0);
                };
                var getGrid = function() {
                    var selectedTab = $scope.tabStrip.select().index();
                    var tabContent = angular.element($scope.tabStrip.contentElement(selectedTab));
                    return tabContent.find('#grid').data("kendoGrid");
                };
                $scope.exportGridExcel = function() {
                    var excelGrid = getGrid();
                    var optionsExcel = {
                        allPages: false
                    };
                    exportUtil.exportToExcel(excelGrid, optionsExcel);
                };
                $scope.exportGridCsv = function() {
                    var excelGrid = getGrid();
                    exportUtil.exportToCsv(excelGrid);
                };
            }
        ]);
    });
})();