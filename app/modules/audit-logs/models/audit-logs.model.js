/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('auditLogsModel', ['isMobileView','authenticationFactory', function (isMobileView,authenticationFactory) {
            var model = {};
            model.getAuditLogsConfig = function () {
                var _configs = {};
                _configs.groupable = false;
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "createdAt": { type: "date" },
                                "createdBy": { type: "string" },
                                "createdFor": {type: "string"},
                                "activity": {type: "string"},
                                "workOrder" : {type: "string"},
                                "businessJustification": {type: "string"},
                                "changes": { type: "string" }
                            }
                        }
                    },
                    pageSize: 20
                    //sort: { field: "version", dir: "asc" }
                };
                _configs.columns = [
                    {
                        field: "createdAt", title: "Date", resizable: true, filterable: false, width: "15%"
                    },
                    {
                        field: "createdBy", title: "Action By", resizable: true, filterable: false, width: "10%"
                    },
                    {
                        field: "createdFor", title: "Action For", resizable: true, filterable: false, width: "10%"
                    },
                    {
                        field: "activity", title: "Activity Log", resizable: true, filterable: false, width: "15%"
                    },
                    {
                        field: "workOrder", title: "Work Order", resizable: true, filterable: false, width: "10%"
                    },
                    {
                        field: "businessJustification", title: "Business Justification", resizable: true, filterable: false, width: "20%"
                    },
                    {
                        field: "changes", title: "Data", encoded: false, resizable: true, filterable: false, width: "20%"
                    }
                ];

                _configs.getDefaultFilterWithFilterText = function (searchText) {
                    var q = searchText;
                    var fltr = {
                        logic: "or",
                        filters:
                            [
                                { field: "createdAt", operator: "contains", value: q },
                                { field: "createdBy", operator: "contains", value: q },
                                { field: "createdFor", operator: "contains", value: q },
                                { field: "activity", operator: "contains", value: q },
                                { field: "workOrder", operator: "contains", value: q },
                                { field: "businessJustification", operator: "contains", value: q }
                            ]
                    };
                    if(isMobileView) {
                        fltr.filters = [
                            { field: "createdAt", operator: "contains", value: q },
                            { field: "createdBy", operator: "contains", value: q },
                            { field: "createdFor", operator: "contains", value: q },
                            { field: "activity", operator: "contains", value: q },
                            { field: "workOrder", operator: "contains", value: q },
                            { field: "businessJustification", operator: "contains", value: q }
                        ]
                    }
                    return fltr;
                };

                return _configs;
            };

            return model;
        }]);
    });
})();
