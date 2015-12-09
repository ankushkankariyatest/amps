/**
 * Created by wizdev on 7/16/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'app-config','appInfra-model', 'appInfra-service'], function (app) {
        app.register.directive('appInfraTabWrapper', ['appInfraModel', function (appInfraModel) {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/application/templates/app-infra.html',
                scope: { key: '@' },
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
                            ],
                            middleware:[
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
                }
            };
        }]);
        app.register.directive('appInfraTabGrid', ['$rootScope','appInfraModel', 'appInfraService', 'popupService', 'appConfig',function ($rootScope, appInfraModel, appInfraService, popupService, appConfig) {
            return {
                restrict: "AE",
                scope:{
                    activeData:'=',
                    popup: '='
                },
                link: function ($scope, element, attr) {
                    var modelInfo = appInfraModel.getModel();
                    if('middleware' == modelInfo.type){ // Middleware
                        element.kendoGrid({
                            dataSource: {
                                pageSize: 20,
                                schema: {
                                    model: {
                                        fields: {
                                            "domain": { type: "string" },
                                            "domainID": { type: "string" },
                                            "environment": { type: "string" },
                                            "highAvailability": { type: "string" },
                                            "software": { type: "string" },
                                            "softwareVersion": { type: "string" },
                                            "systemID": { type: "string" },
                                            "systemName": { type: "string" },
                                            "vendor": { type: "string" }
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
                                        .find('tbody').append('<tr class="kendo-data-row"><td colspan="' + colCount + '"><div class="text-center" style="margin-top: 100px"> No Records available</div></td></tr>');
                                }
                            },
                            autoBind: true,
                            scrollable: true,
                            groupable: false,
                            selectable: false,
                            resizable: true, // to make a column resizable
                            columns:
                                [
                                    { field: "domain", title: "Domain" },
                                    { field: "highAvailability", title: "High Availability" },
                                    { field: "software", title: "Software" },
                                    { field: "softwareVersion", title: "Software Version" },
                                    { field: "systemName", title: "System" },
                                    { field: "vendor", title: "Vendor" },
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
                                                        $rootScope.infraEnvDetails = dataItem;
                                                    }
                                                }
                                            ],
                                        width: "120px",
                                        attributes: { "class": "notForPdf" }
                                    }
                                ],
                            height:"274px"
                        });
                    }else{ // Server and Database
                        element.kendoGrid({
                            dataSource: {
                                pageSize: 20,
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
                            dataBound: function (e) {
                                var grid = e.sender;
                                if (grid.dataSource.total() == 0) {
                                    var colCount = grid.columns.length;
                                    $(e.sender.wrapper)
                                        .find('tbody').append('<tr class="kendo-data-row"><td colspan="' + colCount + '"><div class="text-center" style="margin-top: 100px"> No Records available</div></td></tr>');
                                }
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
                                        width: "120px",
                                        attributes: { "class": "notForPdf" }
                                    }
                                ],
                            height:"274px"
                        });
                    }

                    var appData = appConfig.getApplication();

                    // Check if service call has already loaded data into local object
                    var appId = appInfraModel.getActiveInfraTabAPIs().info.appId;
                    if(!appInfraModel.getTabData(appId, appInfraModel.getActiveInfraTabAPIs().infraTypeServiceAlias)) {
                        appInfraService.createInfrastructureTypeView()
                            .then(function (resp) {
                                // Data not loaded into local object yet, load from service response
                                appInfraModel.setTabData(appId, appInfraModel.getActiveInfraTabAPIs().infraTypeServiceAlias, resp);
                                loadData(resp);
                            });
                    }else{
                        // Load form from the local object
                        loadData(appInfraModel.getTabData(appId, appInfraModel.getActiveInfraTabAPIs().infraTypeServiceAlias));
                    }

                    function loadData(resp){
                        if (resp.isSuccess) {
                            filterData(resp);
                        }
                    }

                    function filterData(response) {
                        var activeTab = $scope.activeData;
                        var data = [];
                        if (modelInfo.type == 'middleware') {
                            data = _.filter(response['middlewareInfrastructure'], function (item) {
                                return Boolean(item.environment.match(activeTab.filterKey));
                            });
                        }
                        if ('database' == modelInfo.type) {
                            data = _.filter(response.response, function (item) {
                                return Boolean(modelInfo.type == item.RELUser_Display_Object_Name.toLowerCase().trim() && item.RELName.match(activeTab.filterKey));
                            });
                        }
                        if ('server' == modelInfo.type) {
                            data = _.filter(response.response, function (item) {
                                return Boolean('database' != item.RELUser_Display_Object_Name.toLowerCase().trim() && item.RELName.match(activeTab.filterKey));
                            });
                        }
                        if(element.data("kendoGrid") && element.data("kendoGrid").dataSource) {
                            element.data("kendoGrid").dataSource.data(data);
                        }
                    };
                }
            };
        }]);
    });
})();