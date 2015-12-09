(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('feedbackListConfig', ['isMobileView','authenticationFactory', function (isMobileView,authenticationFactory) {
            var model = {};
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            id: "ID",
                            fields: {
                                EMAIL: { type: "string" },
                                CONTEXT: { type: "string" },
                                IDENTIFIER: { type: "string" },
                                DESCRIPTION: { type: "string" },
                                //MOOD: { type: "string" },
                                STATUS: { type: "string" },
                                REQUEST_NUMBER: { type: "string" },
                                WORK_ORDER: { type: "string" },
                                LINK: { type: "string" }
                            }
                        }
                    },
                    pageSize: 20
                };
                _configs.columns = [
                        {
                            field: "EMAIL", title: "Email", width: 150, filterable: false
                        }, {
                            field: "CONTEXT", title: "Context", width: 150,
                            filterable: true
                        }, {
                            field: "WORK_ORDER", title: "Work Order", width: 150, filterable: false,
                            template: kendo.template($("#href-template").html())
                        },
                        //{
                        //    field: "MOOD", title: "Mood", width: 150, filterable: false
                        //},
                        {
                            field: "STATUS", title: "Status", width: 150, filterable: false
                        }
                ];

                _configs.getDefaultFilterWithFilterText = function (searchText) {
                    var q = searchText;
                    var fltr = {
                        logic: "or",
                        filters:
                            [
                                    { field: "EMAIL", operator: "contains", value: q },
                                    { field: "CONTEXT", operator: "contains", value: q },
                                    //{ field: "MOOD", operator: "contains", value: q },
                                    { field: "STATUS", operator: "contains", value: q },
                                    { field: "WORK_ORDER", operator: "contains", value: q },
                                    { field: "IDENTIFIER", operator: "contains", value: q },
                                    { field: "REQUEST_NUMBER", operator: "contains", value: q },
                                    { field: "LINK", operator: "contains", value: q }
                            ]
                    };
                    if(isMobileView) {
                        fltr.filters = [
                            { field: "EMAIL", operator: "contains", value: q },
                            { field: "CONTEXT", operator: "contains", value: q },
                            //{ field: "MOOD", operator: "contains", value: q },
                            { field: "STATUS", operator: "contains", value: q },
                            { field: "WORK_ORDER", operator: "contains", value: q }
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