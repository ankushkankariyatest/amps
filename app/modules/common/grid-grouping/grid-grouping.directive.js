/**
 * Created by wizdev on 8/7/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.directive('gridGrouping',  function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/common/grid-grouping/grid-grouping.html',
                scope:{
                    options:'=',
                    callbackGroup:'&?'
                },
                link: function ($scope, element, attrs) {
                    element.find('.k-grouping-header').on('click', 'a.k-button.k-button-icon.k-button-bare', function(event) {
                        var _name = $(event.currentTarget).attr('data-field');
                        var activeCol = $scope.groupByCol.activeGroupByColumns;
                        for(var i = activeCol.length; i--;){
                            if (_name == activeCol[i].field) {
                                $scope.groupByCol.columns[_name].isSelected = false;
                                activeCol.splice(i, 1);
                                $('#grid').getKendoGrid().dataSource.group(activeCol);
                                $scope.$evalAsync($scope.callbackGroup());
                            }
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    });
                },
                controller:function($scope){
                    $scope.$on("$destroy", $scope.$watch('options', function (newVal, oldVal) {
                            if(undefined !== newVal && newVal && newVal != oldVal) {
                               var _allColumns =  _.object(_.pluck(newVal.columns, 'field'), newVal.columns);
                                $scope.groupByCol = {
                                    activeGroupByColumns: newVal.activeGroupColumns,
                                    columns: _allColumns,
                                    groupByCols: function (event, columnInfo) {
                                        event.preventDefault();
                                        if(!columnInfo.isSelected) {
                                            columnInfo.isSelected = true;
                                            var _arrayObj = _.indexBy(this.activeGroupByColumns, 'field');
                                            var has = _arrayObj[columnInfo.field];
                                            if (!has) {
                                                var _model = {
                                                    field: columnInfo.field,
                                                    title: columnInfo.title,
                                                    aggregates: [{field: columnInfo.field, aggregate: "count"}]
                                                };
                                                this.activeGroupByColumns.push(_model);
                                                $('#grid').getKendoGrid().dataSource.group(this.activeGroupByColumns);
                                                $scope.$evalAsync($scope.callbackGroup());
                                            }
                                        }
                                    }
                                };

                                // Set grouping by default initially
                                var activeCol = $scope.groupByCol.activeGroupByColumns;
                                if(activeCol) {
                                    for (var i = activeCol.length; i--;) {
                                        //if (_name == activeCol[i].field) {
                                        //debugger;
                                        $scope.groupByCol.columns[activeCol[i].field].isSelected = true;
                                        //activeCol.splice(i, 1);

                                        //}
                                    }
                                    if (activeCol && activeCol.length > 0) {
                                        var data =  $('#grid').getKendoGrid().dataSource.data();
                                        var dataLength = data.length;
                                        $('#grid').getKendoGrid().dataSource.group(activeCol);
                                        $('#grid').getKendoGrid().dataSource.pageSize(dataLength);
                                        var pageable = {
                                            refresh: false,
                                            input: true,
                                            numeric: false,
                                            pageSize: dataLength,
                                            pageSizes: [dataLength]
                                        };
                                        $('#grid').getKendoGrid().setOptions({pageable: pageable});
                                        $('#grid').getKendoGrid().setOptions({sortable: false});
                                        $scope.$evalAsync($scope.callbackGroup());
                                    }else{
                                        $('#grid').getKendoGrid().dataSource.pageSize(20); // Reset to default
                                        var pageable = {
                                            refresh: false,
                                            input: true,
                                            numeric: false,
                                            pageSize: 20,
                                            pageSizes: [20, 50, 100, 200]
                                        };
                                        $('#grid').getKendoGrid().setOptions({pageable: pageable});
                                        $('#grid').getKendoGrid().setOptions({sortable: true});
                                    }
                                }
                            }
                        }, true));
                }
            }
        });
    });
})();