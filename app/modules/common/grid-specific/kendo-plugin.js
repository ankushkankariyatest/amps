(function () {
    "use strict";
    define(['assetIt', 'kendo.all.min', 'export-util'], function (app) {
        app.register.directive('kendoPlugin', ['exportUtil', function (exportUtil) {
            return {
                restrict: "AE",
                scope: {
                    config: '=',
                    gridOptions: '=?',
                    filterGridFn: '=?',
                    highlightFn: '=?',
                    showPopup: '&?',
                    customFn: '&?',
                    exportTo: '=?',
                    searchTextData: '=?',
                    filterGridByFilterPlugin:'=?'
                },
                link: function ($scope, element, attr) {
                    var expandedRow;

                    var _commonConfig = {
                        dataSource: $scope.config.dataSource,
                        sortable: {
                            mode: "single",
                            allowUnsort: false
                        },
                        autoBind: true,
                        scrollable: false,
                        groupable: false,
                        selectable: false,
                        pageable: {
                            refresh: false,
                            input: true,
                            numeric: false,
                            pageSize: 20,
                            pageSizes: [20, 50, 100, 200],
                            /*change:function(e){
                                $scope.highlightFn($scope.searchTextData);
                            }*/
                        },
                        resizable: true, // to make a column resizable
                        columns: $scope.config.columns,
                        detailExpand: function (e) {
                            
                            $(".open").removeClass("open");
                               $("ul.dropdown-menu.dropdown-menu-form").css("display", "none");
                            if (expandedRow != null && expandedRow[0] != e.masterRow[0]) {
                                element.data("kendoGrid").collapseRow(expandedRow);
                            }
                            expandedRow = e.masterRow;
                            $scope.highlightFn($scope.searchTextData);
                        },
                        detailCollapse: function(e) {
                            $(".open").removeClass("open");
                               $("ul.dropdown-menu.dropdown-menu-form").css("display", "none");
                        }
                    };
                    _commonConfig.dataSource.error = function (e) {
                        element.find('.k-grid-content tbody').html('<tr><td colspan="5"><div class="text-center">' + e.xhr.message + '</div></td></tr>'); // displays "Invalid query"
                    };

                    angular.extend(_commonConfig, $scope.config);

                    var _grid = element.kendoGrid(_commonConfig);

                    _grid.data('kendoGrid').dataSource.bind('change',function(e){
                        $scope.highlightFn($scope.searchTextData);
                    });

                    $scope.filterGridFn = function (q, fltr) {
                        if(q.length == 0) {
                            fltr = {};
                        }
                        $scope.searchTextData = q;
                        element.data("kendoGrid").dataSource.filter(fltr);
                        $scope.highlightFn(q);
                    }

                    $scope.filterGridByFilterPlugin = function (fltr, clearAll) {
                        if(clearAll){
                            $scope.searchTextData = '';
                            element.data("kendoGrid").dataSource.filter({});
                        }else {
                            element.data("kendoGrid").dataSource.filter(fltr);
                        }
                    }

                    $scope.config.refreshGrid = function(columns, data){
                        element.data("kendoGrid").dataSource.group([]);
                        element.data("kendoGrid").setOptions({
                            columns: columns
                        });
                        element.data("kendoGrid").refresh();
                    }

                    $scope.config.updateGrid = function(data) {
                        element.data("kendoGrid").dataSource.data(data);
                    };

                    $scope.highlightFn = function (q) {
                        if (q && q.length > 0) {
                            element.find("tbody tr td").highlight(q);
                            element.find("tbody tr.k-master-row").highlight(q);
                            element.find("tbody tr.k-detail-row td").highlight(q);
                            element.find("tbody tr.k-detail-row .assetIT-main-app_details_block").highlight(q);
                        } else {
                            $scope.unhighlightFn();
                        }
                    };
                    $scope.unhighlightFn =function() {
                        element.find("tbody tr").unhighlight();
                    };
                    $scope.exportTo = function (type) {
                        switch (type) {
                            case 'excel':
                                exportUtil.exportToExcel(element.data("kendoGrid"));
                                break;
                            case 'csv':
                                exportUtil.exportToCsv(element.data("kendoGrid"));
                                break;
                            case 'pdf':
                                exportUtil.exportToPdf(element.data("kendoGrid"));
                                break;
                            default:
                                break;
                        }
                    }

                    var performOperation = function (callbackFn) {
                        callbackFn();
                    }

                    $scope.customFunc = function (item, option) {
                        $scope.$evalAsync($scope.customFn()(item, option, performOperation));
                    }

                    $("div.gridRequiredClass").on('mouseover', 'table tbody tr td:nth-child(2)', function (e) {
                        //$("div .gridRequiredClass").on("mouseover", "tr td:nth-child(2)", function (e) {
                        $(this).find('a.permalink-wrapper').show();
                    });

                    $("div.gridRequiredClass").on('mouseout', 'table tbody tr td:nth-child(2)', function (e) {
                        //$("div .gridRequiredClass").on("mouseout", "tr td:nth-child(2)", function (e) {
                        $(this).find('a.permalink-wrapper').hide();
                    });

                    $("div.gridRequiredClass").on("click", "td:nth-child(2) span.info", function () {
                        if (expandedRow && expandedRow[0] == $(this).closest("tr")[0]) {
                            element.data("kendoGrid").collapseRow(expandedRow);
                            expandedRow = null;
                        } else {
                            element.data("kendoGrid").expandRow($(this).closest("tr"));
                        }
                    });

                }
            };
        }]);
    });
})();