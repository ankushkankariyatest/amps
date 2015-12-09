/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";
    define(['assetIt', 'jquery', 'kendo.all.min', 'export-util', 'infrastructure-menu-service'], function (app, $) {
        app.register.directive('infraGrid', ['infrastructureService', 'exportUtil','$compile', function (infrastructureService, exportUtil, $compile) {
                return {
                    restrict: "AE",
                    scope: {
                        tabname: '@'
                    },
                    template: '<div class="application-container"><div id="grid" class="app-table-bdr"></div></div>',
                    link: function ($scope, element, attr) {
                        var dataError = function (e) {
                          var _message =  (e.xhr.message)?e.xhr.message:'No Record to display';
                            element.find('#grid tbody').html('<tr><td colspan="5"><div class="text-center">' +_message + '</div></td></tr>'); // displays "Invalid query"
                        }
                        var dataService = function (options) {
                            kendo.ui.progress(myElement, false);
                            _decisionMaker[$scope.tabname].serviceName(options.data)
                                    .then(function (resp) {
                                        if (resp.isSuccess) {
                                            for(var i in resp.response.data) {
                                                for(var j in resp.response.data[i]) {
                                                    resp.response.data[i][j] =resp.response.data[i][j]!=null && typeof resp.response.data[i][j]!="object"?resp.response.data[i][j]:"";
                                                }
                                            }
                                            options.success(resp.response);
                                        } else {
                                            options.error(resp);
                                        }
                                    })
                        }
                        var _decisionMaker = {
                            server: {
                                represetnIn:'grid',
                                detailTemplateId: "serverTemplate",
                                serviceName: infrastructureService.getServerList,
                                dataSource: new kendo.data.DataSource({
                                    transport: {
                                        read: dataService
                                    },
                                    pageSize: 20,
                                    schema: {
                                        data: "data",
                                        total: "total",
                                        errors: "message",
                                        model: {
                                            fields: {
                                                "AssetID": {type: "string"},
                                                "Name": {type: "string"},
                                                "Model": {type: "string"},
                                                "firmware_version": {type: "string"},
                                                "ManufacturerName": {type: "string"},
                                                "RequestId":{type: "string"},
                                                "Submitter": {type: "string"},
                                                "CreateDate": {type: "string"},
                                                "LastModifiedBy": {type: "string"},
                                                "ModifiedDate": {type: "string"},
                                                "AssetLifecycleStatus": {type: "string"},
                                                "ShortDescription":{type: "string"},
                                                "CMDBRowLevelSecurity":{type: "string"},
                                                "InstanceId": {type: "string"},
                                                "zTmpAppAdministratorGroupMember": {type: "string"},
                                                "zTmpAppManagementGroupMember": {type: "string"},
                                                "zTmpAppSupportGroupMember": {type: "string"},
                                                "zTmpAdministratorGroupMember": {type: "string"},
                                                "SalesTax_currencyValue":{type: "string"},
                                                "SalesTax_currencyCode":{type: "string"},
                                                "SalesTax_currencyConversionDate":{type: "string"},
                                                "SerialNumber": {type: "string"},
                                                "Category": {type: "string"},
                                                "Type": {type: "string"},
                                                "Item": {type: "string"},
                                                "SiteGroup": {type: "string"},
                                                "Region":{type: "string"},
                                                "PartNumber": {type: "string"},
                                                "zTmpKeyword": {type: "string"},
                                                "zUpdateComponents": {type: "string"},
                                                "AcquiredMethod":{type: "string"},
                                                "Site": {type: "string"},
                                                "CurrentState": {type: "string"},
                                                "InstallationDate": {type: "string"},
                                                "Y2KCompliant":{type: "string"},
                                                "Supported": {type: "string"},
                                                "TagNumber": {type: "string"},
                                                "CostCenter": {type: "string"},
                                                "OrderID":{type: "string"},
                                                "BookValue_currencyValue": {type: "string"},
                                                "BookValue_currencyCode": {type: "string"},
                                                "BookValue_currencyConversionDate": {type: "string"},
                                                "ReceivedDate":{type: "string"},
                                                "FixedAsset": {type: "string"},
                                                "TotalPurchaseCost_currencyValue": {type: "string"},
                                                "TotalPurchaseCost_currencyCode": {type: "string"},
                                                "TotalPurchaseCost_currencyConversionDate":{type: "string"},
                                                "TaxCredit_currencyValue": {type: "string"},
                                                "TaxCredit_currencyCode": {type: "string"},
                                                "TaxCredit_currencyConversionDate": {type: "string"},
                                                "UnitPrice_currencyValue":{type: "string"},
                                                "UnitPrice_currencyCode": {type: "string"},
                                                "UnitPrice_currencyConversionDate": {type: "string"},
                                                "MarketValue_currencyValue": {type: "string"},
                                                "MarketValue_currencyCode":{type: "string"},

                                                "MarketValue_currencyConversionDate": {type: "string"},
                                                "ScheduleType": {type: "string"},
                                                "AssetClass": {type: "string"},
                                                "zTmpSchemaProperName":{type: "string"},
                                                "Depreciated": {type: "string"},
                                                "zWhenAssetsAreDeleted": {type: "string"},
                                                "ImpactComputationModel": {type: "string"},
                                                "Inventory":{type: "string"},
                                                "HostName": {type: "string"},
                                                "PrimaryCapability": {type: "string"},
                                                "SystemType": {type: "string"},
                                                "AdminPasswordStatus":{type: "string"},
                                                "BootROMSupported": {type: "string"},
                                                "ChassisBootupState": {type: "string"},
                                                "ResetCapability": {type: "string"},
                                                "ThermalState":{type: "string"},
                                                "Cost_currencyCode": {type: "string"},
                                                "FailedAutomaticIdentification": {type: "string"},
                                                "Cost_currencyValue": {type: "string"},
                                                "Cost_currencyConversionDate":{type: "string"},
                                                "Priority": {type: "string"},
                                                "DHCPUse": {type: "string"},
                                                "ClassId": {type: "string"},
                                                "DatasetId":{type: "string"},
                                                "MarkAsDeleted": {type: "string"},
                                                "ReconciliationIdentity": {type: "string"},
                                                "deleted": {type: "string"},
                                                "LastREJobrunId":{type: "string"},
                                                "UserDisplayObjectName": {type: "string"},
                                                "TokenId": {type: "string"},
                                                "VirtualSystemType": {type: "string"},
                                                "Confidentiality":{type: "string"},
                                                "Availability": {type: "string"},
                                                "Integrity": {type: "string"},
                                                "AttributeDataSourceList": {type: "string"},
                                                "ReferenceInstance":{type: "string"},
                                                "zCMDBEngTimestampStub": {type: "string"},
                                                "NormalizationStatus": {type: "string"},
                                                "isVirtual": {type: "string"},
                                                "ReconciliationMergeStatus":{type: "string"},
                                                "IsUnqualified": {type: "string"},
                                                "ReconciliationIdType": {type: "string"},
                                                "ReconciliationIdChanged": {type: "string"},
                                                "ReconciliationIdentificationError":{type: "string"},
                                                "SAPAssetID": {type: "string"},
                                                "PublicWS": {type: "string"},
                                                "NumOfCPU": {type: "string"},
                                                "RecordOrigin":{type: "string"},
                                                "NERCType": {type: "string"},
                                                "PGEOrganization": {type: "string"},
                                                "SCADASystemName": {type: "string"},
                                                "WheatherCritical":{type: "string"},
                                                "Criticality": {type: "string"},
                                                "LastDiscoveryUpdate": {type: "string"},
                                                "SAPCountyNo": {type: "string"},
                                                "SOX_CI":{type: "string"},
                                                "Company": {type: "string"},
                                                "LocationCompany": {type: "string"},
                                                "StatusReason": {type: "string"},
                                                "Urgency":{type: "string"},
                                                "Impact": {type: "string"}
                                            }
                                        }
                                    },
                                    data: [],
                                    serverPaging: true,
                                    serverFiltering: true,
                                    error: dataError
                                }),
                                columns: [
                                    {field: "Name", title: "Name"},
                                    {field: "ManufacturerName", title: "Manufacturer"},
                                    {field: "Model", title: "Model"},
                                    {field: "firmware_version", title: "Version"}
                                ],
                                getFilter: function (term) {
                                    return {
                                        logic: "or",
                                        filters: [
                                            {field: "AssetID", operator: "eq", value: parseInt(term)},
                                            {field: "Name", operator: "contains", value: term},
                                            {field: "ManufacturerName", operator: "contains", value: term},
                                            {field: "Model", operator: "contains", value: term},
                                            {field: "firmware_version", operator: "contains", value: term},
                                        ]};
                                }
                            },
                            database: {
                                represetnIn:'grid',
                                detailTemplateId: "dbTemplate",
                                serviceName: infrastructureService.getDBList,
                                dataSource: new kendo.data.DataSource({
                                    transport: {
                                        read: dataService
                                    },
                                    pageSize: 20,
                                    schema: {
                                        data: "data",
                                        total: "total",
                                        errors: "message",
                                        model: {
                                            fields: {
                                                "Name": {type: "string"},
                                                "Model": {type: "string"},
                                                "firmware_version": {type: "string"},
                                                "ManufacturerName": {type: "string"},
                                                "RequestId": {type: "string"},
                                                "Submitter": {type: "string"},
                                                "CreateDate": {type: "string"},
                                                "LastModifiedBy": {type: "string"},
                                                "ModifiedDate": {type: "string"},
                                                "AssetLifecycleStatus": {type: "string"},
                                                "ShortDescription": {type: "string"},
                                                "Status-History": {type: "string"},
                                                "CMDBRowLevelSecurity": {type: "string"},
                                                "InstanceId": {type: "string"},
                                                "zTmpAppAdministratorGroupMember": {type: "string"},
                                                "zTmpAppManagementGroupMember": {type: "string"},
                                                "zTmpAppSupportGroupMember": {type: "string"},
                                                "zTmpAdministratorGroupMember": {type: "string"},
                                                "SalesTax_currencyValue": {type: "string"},
                                                "SalesTax_currencyCode": {type: "string"},
                                                "SalesTax_currencyConversionDate": {type: "string"},
                                                "Category": {type: "string"},
                                                "Type": {type: "string"},
                                                "Item": {type: "string"},
                                                "zTmpKeyword": {type: "string"},
                                                "zUpdateComponents": {type: "string"},
                                                "VersionNumber": {type: "string"},
                                                "AcquiredMethod": {type: "string"},
                                                "CurrentState": {type: "string"},
                                                "InstallationDate": {type: "string"},
                                                "Y2KCompliant": {type: "string"},
                                                "Supported": {type: "string"},
                                                "CostCenter": {type: "string"},
                                                "BookValue_currencyValue": {type: "string"},
                                                "BookValue_currencyCode": {type: "string"},
                                                "BookValue_currencyConversionDate": {type: "string"},
                                                "FixedAsset": {type: "string"},
                                                "TotalPurchaseCost_currencyValue": {type: "string"},
                                                "TotalPurchaseCost_currencyCode": {type: "string"},
                                                "TotalPurchaseCost_currencyConversionDate": {type: "string"},
                                                "TaxCredit_currencyValue": {type: "string"},
                                                "TaxCredit_currencyCode": {type: "string"},
                                                "TaxCredit_currencyConversionDate": {type: "string"},
                                                "UnitPrice_currencyValue": {type: "string"},
                                                "UnitPrice_currencyCode": {type: "string"},
                                                "UnitPrice_currencyConversionDate": {type: "string"},
                                                "MarketValue_currencyValue": {type: "string"},
                                                "MarketValue_currencyCode": {type: "string"},
                                                "MarketValue_currencyConversionDate": {type: "string"},
                                                "ScheduleType": {type: "string"},
                                                "AssetClass": {type: "string"},
                                                "zTmpSchemaProperName": {type: "string"},
                                                "Depreciated": {type: "string"},
                                                "zWhenAssetsAreDeleted": {type: "string"},
                                                "ImpactComputationModel": {type: "string"},
                                                "Inventory": {type: "string"},
                                                "FailedAutomaticIdentification": {type: "string"},
                                                "Cost_currencyValue": {type: "string"},
                                                "Cost_currencyCode": {type: "string"},
                                                "Cost_currencyConversionDate": {type: "string"},
                                                "Priority": {type: "string"},
                                                "ClassId": {type: "string"},
                                                "DatasetId": {type: "string"},
                                                "MarkAsDeleted": {type: "string"},
                                                "ReconciliationIdentity": {type: "string"},
                                                "deleted": {type: "string"},
                                                "LastREJobrunId": {type: "string"},
                                                "UserDisplayObjectName": {type: "string"},
                                                "TokenId": {type: "string"},
                                                "Confidentiality": {type: "string"},
                                                "Availability": {type: "string"},
                                                "Integrity": {type: "string"},
                                                "ReferenceInstance": {type: "string"},
                                                "zCMDBEngTimestampStub": {type: "string"},
                                                "NormalizationStatus": {type: "string"},
                                                "ReconciliationMergeStatus": {type: "string"},
                                                "NEFeatureStatusMask": {type: "string"},
                                                "ReconciliationIdType": {type: "string"},
                                                "ReconciliationIdChanged": {type: "string"},
                                                "ReconciliationIdentificationError": {type: "string"},
                                                "LegacyID": {type: "string"},
                                                "NERCType": {type: "string"},
                                                "PGEOrganization": {type: "string"},
                                                "WheatherCritical": {type: "string"},
                                                "Criticality": {type: "string"},
                                                "LastDiscoveryUpdate": {type: "string"},
                                                "SOX_CI": {type: "string"},
                                                "Company": {type: "string"},
                                                "LocationCompany": {type: "string"},
                                                "StatusReason": {type: "string"},
                                                "Urgency": {type: "string"},
                                                "Impact": {type: "string"},
                                            }
                                        }
                                    },
                                    data: [],
                                    serverPaging: true,
                                    serverFiltering: true,
                                    error: dataError
                                }),
                                columns: [
                                    {field: "Name", title: "Name"},
                                    {field: "ManufacturerName", title: "Manufacturer"},
                                    {field: "Model", title: "Model"},
                                    {field: "VersionNumber", title: "Version"}
                                ],
                                getFilter: function (term) {
                                    return {
                                        logic: "or",
                                        filters: [
                                            {field: "Name", operator: "contains", value: term},
                                            {field: "ManufacturerName", operator: "contains", value: term},
                                            {field: "Model", operator: "contains", value: term},
                                            {field: "VersionNumber", operator: "contains", value: term},
                                        ]};
                                }
                            },
                            middleware: {
                                represetnIn:'grid',
                                detailTemplateId: "middlewareTemplate",
                                dataSource: new kendo.data.DataSource({
                                    pageSize: 20,
                                    schema: {
                                        model: {
                                            fields: {
                                                "HostName": {type: "string"},
                                                "Model": {type: "string"},
                                                "firmware_version": {type: "string"},
                                                "ManufacturerName": {type: "string"}
                                            }
                                        }
                                    },
                                    data: []
                                }),
                                columns: [
                                    {field: "HostName", title: "Host"},
                                    {field: "ManufacturerName", title: "Manufacturer"},
                                    {field: "Model", title: "Model"},
                                    {field: "VersionNumber", title: "Version"}
                                ]
                            }
                        };
                        var myElement = element.find('#grid');

                        var _activeViewOptions =  _decisionMaker[$scope.tabname];
                        var initialize = function () {
                            myElement.kendoGrid({
                                dataSource: _activeViewOptions.dataSource,
                                autoBind: true,
                                filterable: {
                                    extra: false
                                },
                                scrollable: false,
                                groupable: false,
                                selectable: false,
                                pageable: {
                                    refresh: false,
                                    input: true,
                                    numeric: false,
                                    pageSize: 20,
                                    pageSizes: [20, 50, 100, 200]
                                },
                                columns: _activeViewOptions.columns,
                                resizable: true, // to make a column resizable
                                detailTemplate: kendo.template($("#" + _activeViewOptions.detailTemplateId).html()),
                                detailInit: detailInit,
                                detailExpand: detailExpandFn
                            }).data("kendoGrid");
                        };
                        var detailInit = function (e) {
                            var detailRow = e.detailRow;
                            detailRow.find(".tabstrip").kendoTabStrip({
                                animation: {
                                    open: {effects: "fadeIn"}
                                },
                                select:function(event){
                                    if (event.item.textContent.indexOf('Feedback') > -1) {
                                        $compile(event.contentElement)($scope);
                                    }
                                    if('Application' == event.item.innerText){
                                        $compile(event.contentElement)($scope);
                                    }
                                    if('Work Tickets' == event.item.innerText){
                                        $compile(event.contentElement)($scope);
                                    }
                                }
                            });
                            kendo.bind(detailRow, e.data);
                        };

                        var expandedRow;
                        var detailExpandFn = function (e) {
                            if (expandedRow != null && expandedRow[0] != e.masterRow[0]) {
                                var grid = myElement.data('kendoGrid');
                                grid.collapseRow(expandedRow);
                            }
                            expandedRow = e.masterRow;
                        }
                        var highlightText = function (q) {
                            if (q && q.length > 0) {
                                element.find("#grid tbody tr.k-master-row").highlight(q);
                                //element.find("#grid tbody tr.k-detail-row td").highlight(q);
                                element.find("#grid tbody tr.k-detail-row div.k-content div.row div:nth-child(even)").highlight(q);
                            }
                        }
                        initialize();
                        //Search Event
                        element.find('#txtSearchString').bind('input propertychange', function (e) {
                            var q = this.value;
                            var fltr = _decisionMaker[$scope.tabname].getFilter(q);
                            var grid = myElement.data("kendoGrid");
                            var filter = grid.dataSource.filter();
                            var myFilters = filter ? filter : {filters: [], logic: "and"};
                            for (var i in myFilters.filters) {
                                if (myFilters.filters[i].filters !== undefined) {
                                    myFilters.filters.splice(i, 1);
                                }
                            }
                            var ds = grid.dataSource;
                            myFilters.filters.push(fltr);
                            ds.filter(myFilters);

                            highlightText(q);
                        });
                        $scope.updateFeedbackCount = function(appId, count){

                        };
                    }
                };
            }]);
        app.register.directive('appDetailsWrapper',['infrastructureService', function (infrastructureService) {
            return {
                restrict: "AE",
                scope:{
                    instanceId:'@'
                },
                templateUrl:'app/modules/infra/templates/infra-server-app-details.html',
                //template: '<div class="row assetIT-main-app_details_block" ng-repeat="(k, v) in data"><div class="col-md-3 col-sm-4"><label>{{k}}: </label></div><div class="col-md-3 col-sm-4">{{v}}</div></div>',
                link: function ($scope, element, attr) {
                    infrastructureService.getServerApplicationDetails($scope.instanceId).then(function (resp) {
                        $scope.data = resp;
                    });
                }
            };
        }]);
        app.register.directive('workDetailsWrapper',['infrastructureService', function (infrastructureService) {
            return {
                restrict: "AE",
                scope:{
                    instanceId:'@'
                },
                templateUrl:'app/modules/infra/templates/infra-server-work-details.html',
                //template: '<div class="row assetIT-main-app_details_block" ng-repeat="(k, v) in data"><div class="col-md-3 col-sm-4"><label>{{k}}: </label></div><div class="col-md-3 col-sm-4">{{v}}</div></div>',
                link: function ($scope, element, attr) {
                    infrastructureService.getInfraWorkDetails($scope.instanceId).then(function (resp) {
                        $scope.data = resp;
                    });
                }
            };
        }]);
    });
})();