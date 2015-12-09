/// <reference path="../" />

(function () {
    "use strict";
    define(['assetIt', 'app-config', 'appInfra-model', 'appInfra-service'], function (app) {
        /*
         app.register.directive('appInfraWrapper', ['appInfraModel', function (appInfraModel) {
         return {
         restrict: "AE",
         templateUrl: 'app/modules/application/templates/app-infra.html',
         scope: {
         key: '@',
         popup: '@'
         },
         link: function ($scope, element, attr) {

         },
         controller: function ($scope) {
         $scope.openActiveTab = function (type) {
         appInfraModel.setModel({ appId: $scope.key, type: type });
         $scope.tabsInfo = appInfraModel.getActiveInfrastructureTab();
         var gridUrl = 'app/modules/application/templates/infra/app-infra-grid.html';
         var infra = {
         server: [
         { title: "Production", isOpen: false, filterKey: '^((?!QA|TST|DEV).)*$', templateUrl: gridUrl },
         { title: "QA", isOpen: false, filterKey: 'QA', templateUrl: gridUrl },
         { title: "Test", isOpen: false, filterKey: 'TST', templateUrl: gridUrl },
         { title: "Development", isOpen: false, filterKey: 'DEV', templateUrl: gridUrl }
         ],
         database: [
         { title: "Production", isOpen: false, filterKey: '^((?!QA|TST|DEV).)*$', templateUrl: gridUrl },
         { title: "QA", isOpen: false, filterKey: 'QA', templateUrl: gridUrl },
         { title: "Test", isOpen: false, filterKey: 'TST', templateUrl: gridUrl },
         { title: "Development", isOpen: false, filterKey: 'DEV', templateUrl: gridUrl }
         ]
         };
         // Get active Infra like database is active or server or middleware
         var modelInfo = appInfraModel.getModel();
         $scope.accordianItems = infra[modelInfo.type];
         }
         if($scope.popup) {
         $scope.openActiveTab('server');
         }
         }
         };
         }]);
         app.register.directive('appInfraGrid', ['$rootScope','appInfraModel', 'appInfraService', 'popupService', 'appConfig',function ($rootScope, appInfraModel, appInfraService, popupService, appConfig) {
         return {
         restrict: "AE",
         scope:{
         activeData:'=',
         popup: '=',
         },
         link: function ($scope, element, attr) {
         element.kendoGrid({
         dataSource: {
         pageSize: 20,
         /!*change: function (e) {
         if (this.total() > 0) {
         element.find(".empty-grid").css('display', 'none');
         return; // continue only for empty grid
         }
         var msg =this.options.emptyMsg;
         if (!msg) msg = 'No records to display'; // Default message
         if(element.find(".k-grid-content").find(".empty-grid").length == 0) {
         element.find(".k-grid-content").append('<div class="empty-grid" style="font-weight:bold; top:45%; left:37%; position:absolute; display:block ">' + msg + '</div>');
         } else {
         element.find(".empty-grid").html(msg);
         element.find(".empty-grid").css('display', 'block');
         }
         },*!/
         schema: {
         model: {
         fields: {
         "BEAssetID": { type: "string" },
         "BDAssetClass": { type: "string" },
         "RELItem": { type: "string" },
         "RELModel": { type: "string" },
         "RELName": { type: "string" },
         "RELUser_Display_Object_Name": { type: "string" },
         "BEClassId": { type: "string" },
         "BEDatasetId": { type: "string" },
         "BEDescription": { type: "string" },
         "BEInstanceId": { type: "string" },
         "BEName": { type: "string" },
         "BEReconciliationIdentity": { type: "string" },
         "BESerialNumber": { type: "string" },
         "BEShortDescription": { type: "string" },
         "RELAssetReconciliationIdentity": { type: "string" },
         "RELAsset_Class_Id": { type: "string" },
         "RELAsset_Instance_ID": { type: "string" },
         "RELCategory": { type: "string" },
         "RELClass_Id": { type: "string" },
         "RELDatasetId": { type: "string" },
         "RELInstance_Id": { type: "string" },
         "RELVersionNumber": { type: "string" },
         "RELRelationshipName": { type: "string" },
         "RELSource.ReconciliationIdentity": { type: "string" },
         "RELType": { type: "string" },
         "Request_ID": { type: "string" }
         }
         }
         },
         data: []
         },
         autoBind: true,
         scrollable: true,
         groupable: false,
         selectable: false,
         resizable: true, // to make a column resizable
         columns:
         [
         { field: "BDAssetClass", title: "Asset" },
         { field: "RELUser_Display_Object_Name", title: "Asset Object" },
         { field: "RELName", title: "Name" },
         { field: "RELModel", title: "Model" },
         { field: "RELVersionNumber", title: "OS Version" },
         {
         command:
         [
         {
         name: "More Details",
         click: function (e) {
         e.preventDefault();
         var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
         appInfraModel.setEnvDetailData(dataItem);

         var modelInfo = appInfraModel.getModel();
         popupService.showInfrastructureDetails(modelInfo.type);
         appInfraService.getInfraDetailsByEnvironment(dataItem.RELAsset_Instance_ID).then(function (svcData) {
         $rootScope.infraEnvDetails = svcData.response;
         });
         }
         }
         ],
         width: "120px"
         }
         ],
         height: "274px"
         });
         var appData = appConfig.getApplication();
         if($scope.popup && appData.INFRASTRUCTURE!=undefined) {
         filterData(appData.INFRASTRUCTURE);
         } else {
         appInfraService.createInfrastructureTypeView()
         .then(function (resp) {
         if (resp.isSuccess) {
         filterData(resp.response);
         }
         else {
         element.data("kendoGrid").dataSource.emptyMsg = resp.message;
         }
         });
         }
         function filterData(response) {
         var modelInfo = appInfraModel.getModel();

         var activeTab = $scope.activeData;//_.filter($scope.accordianItems, function (q) { return q.isOpen == true });
         var data = [];
         if ('database' == modelInfo.type) {
         data = _.filter(response, function (item) {
         return Boolean(modelInfo.type == item.RELUser_Display_Object_Name.toLowerCase().trim() && item.RELName.match(activeTab.filterKey));
         });
         }
         if ('server' == modelInfo.type) {
         data = _.filter(response, function (item) {
         return Boolean('database' != item.RELUser_Display_Object_Name.toLowerCase().trim() && item.RELName.match(activeTab.filterKey));
         });
         }
         if ($scope.type == 'popup') {
         appConfig.updateInfra(response);
         }
         element.data("kendoGrid").dataSource.data(data);
         };
         }
         };
         }]);

         app.register.controller('infraDetailsByEnvironmentController', ['$scope', 'appInfraService', function ($scope, appInfraService) {
         $scope.infraDetailsByEnvironment = function () {
         appInfraService.getActiveInfraDetailsByEnvironment().then(function (svcData) {
         $scope.infraEnvDetails = svcData.response;
         });
         }
         }]);
         */

        app.register.directive('appInfraGridsWrapper', ['appInfraModel', 'appInfraService', 'appConfig', function (appInfraModel, appInfraService, appConfig) {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/application/templates/app-infra-grids-wrapper.html',
                scope: {
                    key: '@'
                },
                link: function ($scope, element, attr) {
                    /* element.find("#infra-filter-menu li").click(function() {
                     alert('hi');
                     $(this).dropdown("toggle");
                     return false;
                     });*/
                },
                controller: function ($scope) {
                    var gridUrl = 'app/modules/application/templates/infra/environment-grid.html';

                    function filterData(subEnvionment, environment, activeFilter) {
                        subEnvionment.activeFilter = activeFilter.item;

                        var _data = [];
                        angular.extend(_data, $scope.infraEnvironments[environment].originalData);
                        if (environment == 'middleware') {
                            subEnvionment.data = _.filter(_data, function (item) {
                                return Boolean(item.environment.match(activeFilter.filterKey));
                            });
                        } else {
                            subEnvionment.data = _.filter(_data, function (item) {
                                return Boolean(item.RELName.match(activeFilter.filterKey));
                            });
                        }

                    }

                    var _filters = [
                        {item: 'All', filterKey: '', filterData: filterData},
                        {item: 'Production', filterKey: '^((?!QA|TST|DEV).)*$', filterData: filterData},
                        {item: 'QA', filterKey: 'QA', filterData: filterData},
                        {item: 'Test', filterKey: 'TST', filterData: filterData},
                        {item: 'Development', filterKey: 'DEV', filterData: filterData}
                    ]
                    var infra = {
                        server: {name: 'SERVER', activeFilter: 'All', data: [], originalData: [], filters: _filters},
                        database: {
                            name: 'DATABASE',
                            activeFilter: 'All',
                            data: [],
                            originalData: [],
                            filters: _filters
                        },
                        middleware: {
                            name: 'MIDDLEWARE',
                            activeFilter: 'All',
                            data: [],
                            originalData: [],
                            filters: _filters
                        }
                    };

                    $scope.infraEnvironments = infra;

                    $scope.infraArray = [
                        {key: 'server', seq: 1, envi: infra.server},
                        {key: 'database', seq: 2, envi: infra.database},
                        {key: 'middleware', seq: 2, envi: infra.middleware}
                    ];


                    var infraOptions = {
                        server: {
                            filterKeyFunction: function (key) {
                                return 'database' != key.toLowerCase().trim();
                            }
                        },
                        database: {
                            filterKeyFunction: function (key) {
                                return 'database' == key.toLowerCase().trim();
                            }
                        },
                        middleware: {
                            filterKeyFunction: function (key) {
                                return 'middleware' == key.toLowerCase().trim();
                            }
                        }
                    };
                    var appData = appConfig.getApplication();
                    if (appData.INFRASTRUCTURE != undefined) {
                        filterResponse(appData.INFRASTRUCTURE);
                    } else {
                        appInfraService.createInfraEnvironmentView($scope.key)
                            .then(function (resp) {
                                if (resp.isSuccess) {
                                    appConfig.updateInfra(resp);
                                    filterResponse(resp);
                                }
                                else {
                                    appConfig.updateInfra([]);
                                }
                            }, function (error) {
                                appConfig.updateInfra([]);
                            });
                    }
                    //appInfraService.createInfraEnvironmentView($scope.key)
                    //    .then(function (resp) {
                    //        appConfig.updateInfra(resp.response);
                    //        if (resp.isSuccess) {
                    //            $.each(infra, function(key , envi){
                    //                var data = _.filter(resp.response, function (item) {
                    //                    return Boolean( infraOptions[key].filterKeyFunction(item.RELUser_Display_Object_Name));
                    //                });
                    //                envi.data = data;
                    //                envi.originalData = data;
                    //            });
                    //        }
                    //    }, function(error){
                    //        appConfig.updateInfra([]);
                    //    });

                    function filterResponse(response) {
                        $.each(infra, function (key, envi) {
                            var data = response[key];
                            envi.data = data;
                            envi.originalData = data;
                        });
                    }
                }
            };
        }]);

        app.register.directive('infraEnvironmentGrid', ['$rootScope', 'appInfraModel', 'popupService', 'appInfraService', function ($rootScope, appInfraModel, popupService, appInfraService) {
            return {
                restrict: "AE",
                scope: {
                    data: '=',
                    type: '@',
                    changeDataFn: '@'
                },
                link: function ($scope, element, attr) {
                    if ($scope.type == 'middleware') {
                        element.kendoGrid({
                            dataSource: {
                                pageSize: 20,
                                schema: {
                                    model: {
                                        fields: {
                                            "domain": {type: "string"},
                                            "domainID": {type: "string"},
                                            "environment": {type: "string"},
                                            "highAvailability": {type: "string"},
                                            "software": {type: "string"},
                                            "softwareVersion": {type: "string"},
                                            "systemID": {type: "string"},
                                            "systemName": {type: "string"},
                                            "vendor": {type: "string"}
                                        }
                                    }
                                },
                                data: []
                            },
                            dataBound: function (e) {
                                var grid = e.sender;
                                if (grid.dataSource.total() == 0) {
                                    var colCount = grid.columns.length;
                                    $(e.sender.wrapper)
                                        .find('tbody').append('<tr class="kendo-data-row"><td colspan="' + colCount + '"><div class="text-center"> No Records available</div></td></tr>');
                                }
                            },
                            autoBind: true,
                            scrollable: true,
                            groupable: false,
                            selectable: false,
                            resizable: true, // to make a column resizable
                            columns: [
                                {field: "domain", title: "Domain"},
                                {field: "highAvailability", title: "High Availability"},
                                {field: "software", title: "Software"},
                                {field: "softwareVersion", title: "Software Version"},
                                {field: "systemName", title: "System"},
                                {field: "vendor", title: "Vendor"}
                            ]
                        });
                    } else {
                        element.kendoGrid({
                            dataSource: {
                                pageSize: 20,
                                data: []
                            },
                            autoBind: true,
                            scrollable: false,
                            groupable: false,
                            selectable: false,
                            resizable: true, // to make a column resizable
                            columns: [
                                {field: "BDAssetClass", title: "Asset"},
                                {field: "RELUser_Display_Object_Name", title: "Asset Object"},
                                {field: "RELName", title: "Name"},
                                {field: "RELModel", title: "Model"},
                                {field: "RELVersionNumber", title: "OS Version"}
                                /*{
                                 command:
                                 [
                                 {
                                 name: "More Details",
                                 click: function (e) {
                                 e.preventDefault();
                                 var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                                 popupService.showInfrastructureDetails($scope.type);
                                 appInfraService.getInfraDetailsByEnvironment(dataItem.RELAsset_Instance_ID).then(function (svcData) {
                                 $rootScope.infraEnvDetails = svcData.response;
                                 });
                                 }
                                 }
                                 ],
                                 width: "120px",
                                 attributes: {"class": "notForPdf"},
                                 headerAttributes: { "class": "notForPdf"}
                                 }*/
                            ],
                            dataBound: function (e) {
                                var grid = e.sender;
                                if (grid.dataSource.total() == 0) {
                                    var colCount = grid.columns.length;
                                    $(e.sender.wrapper)
                                        .find('tbody').append('<tr class="kendo-data-row"><td colspan="' + colCount + '">No Record available..</td></tr>');
                                }
                            }
                        });
                    }
                    $scope.$watch('data', function (data) {
                        element.data("kendoGrid").dataSource.data($scope.data);
                    }, true);
                }
            };
        }]);
    });
})();