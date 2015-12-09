(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('certificationListConfig', ['isMobileView','authenticationFactory', function (isMobileView, authenticationFactory) {
            var model = {};
            var appData ={};
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "version": {type: "Number"},
                                "identifier": { type: "string" },
                                "createdBy": { type: "string" },
                                "createdOnStr": { type: "string" },
                                "role": { type: "string" },
                                "workOrder": { type: "string" },
                                "statusStr": { type: "string" }
                            }
                        }
                    },
                    pageSize: 20
                };
                _configs.columns = [
                    {
                        field: "version", title: "Version", resizable: true, filterable: false, width: "10%"

                    },
                    {
                        field: "identifier", title: "Application ID", resizable: true, filterable: false, width: "10%"

                    },
                    {
                        field: "createdBy", title: "Email", resizable: true, filterable: false, width: "20%"

                    },
                    {
                        field: "role", title: "Role", resizable: true, filterable: false, width: "10%"

                    },
                    {
                        field: "workOrder", title: "Work Order", resizable: true, filterable: false, width: "10%"

                    },
                    {
                        field: "createdOnStr", title: "Date", resizable: true, filterable: false, width: "20%"
                    },
                    {
                        field: "statusStr", title: "Status", resizable: true, filterable: false, width: "10%", template: function (data) {
                        return data.status ? "<span><i class='icon_certified_count'></i>Certified</span>" : "<span><i class='icon_rejected_count'></i>Rejected</span>";
                    }
                    },
                    {
                        title: "View", resizable: true, filterable: false, template: function appTemplate(data) {
                            return '<span class="appBacr icon-captured"></span>'
                        }, width: "10%"
                    }
                ];

                _configs.getDefaultFilterWithFilterText = function (searchText) {
                    var q =  $.trim(searchText);
                    var fltr = {
                        logic: "or",
                        filters:
                            [
                                { field: "identifier", operator: "contains", value: q },
                                { field: "createdBy", operator: "contains", value: q },
                                { field: "role", operator: "contains", value: q },
                                { field: "workOrder", operator: "contains", value: q },
                                { field: "createdOnStr", operator: "contains", value: q },
                                { field: "statusStr", operator: "contains", value: q }
                            ]
                    };
                    if(isMobileView) {
                        fltr.filters = [
                            { field: "identifier", operator: "contains", value: q },
                            { field: "createdBy", operator: "contains", value: q },
                            { field: "role", operator: "contains", value: q },
                            { field: "workOrder", operator: "contains", value: q },
                            { field: "createdOnStr", operator: "contains", value: q },
                            { field: "statusStr", operator: "contains", value: q }
                        ]
                    }
                    if(!isNaN(q)) {
                        fltr.filters.push({ field: "version", operator: "eq", value: parseInt(q) });
                        fltr.filters.push({ field: "identifier", operator: "contains", value: q });
                    }
                    return fltr;
                };
                return _configs;
            };

            return model;
        }]);
    });
})();