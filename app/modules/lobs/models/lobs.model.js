(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('lobsConfig', ['isMobileView','authenticationFactory', function (isMobileView, authenticationFactory) {
            var model = {};
            var lobNameRegexToMakeId = /[^a-zA-Z0-9]/g;
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            id: "LOB_NAME",
                            fields: {
                                LOB_NAME: { editable: false, type: "string" },
                                COUNT: { editable: false },
                                DESCRIPTION: {
                                    editable: true, type: "string",
                                    validation: {
                                        notempty: function (input) {
                                            var _decisionMaker = {
                                                DESCRIPTION: "description can not be empty",
                                            };
                                            input.attr("data-notempty-msg", _decisionMaker[input.attr("name")]);
                                            return String(input.val()).trim() == '' ? false : true;
                                        }
                                    }
                                }
                            }
                        }
                    },
                    pageSize: 20,
                    sort: { field: "LOB_NAME", dir: "asc" }
                },
                _configs.columns = [
                        {
                            field: "LOB_NAME", title: "LOB Name", width: 350, template: function (data) {
                                var info = (null != data.LOB_NAME) ? data.LOB_NAME : '';
                                return '<span class="info">' + info + '</span><a class="permalink-wrapper" style="display:none;" attr-base="lobs" attr-permalink-key="' + data.LOB_NAME + '"><span class="icon-link"></span></a>';
                            }
                        },
                        {
                            field: "DESCRIPTION", title: "Description", editor: function (container, options) {
                                $('<textarea data-bind="value:' + options.field + '" name="' + options.field + '" rows="5" cols="42"></textarea>').appendTo(container);
                            }
                        },
                        {
                            field: "COUNT", title: "Feedback", width: 90, template: function (data) {
                                return '<span class="comment_count ' + (data.COUNT ? "" : "hide") + '"><i class="icon-caret-down"></i> <span class="feedbackCount' + data.LOB_NAME.replace(lobNameRegexToMakeId, "_") + '">' + data.COUNT + '</span></span>';
                            }
                        },
                        { title: "Actions", command: "edit", name: "", className: "glyphicon glyphicon-edit", width: 100, hidden: authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.admin)==-1}
                ];

                _configs.routeParamFilter = function (name) {
                    return { field: "LOB_NAME", operator: "eq", value: name }
                }
                _configs.getDefaultFilterWithFilterText = function (searchText) {
                    var q = searchText;
                    var fltr = {
                        logic: "or",
                        filters:
                            [
                                { field: "LOB_NAME", operator: "contains", value: q },
                                { field: "DESCRIPTION", operator: "contains", value: q }
                            ]
                    };
                    if(isMobileView) {
                        fltr.filters = [
                            { field: "LOB_NAME", operator: "contains", value: q }
                        ]
                    }
                    return fltr;
                }
                return _configs;
            };

            model.getSubGridConfigs = function () {
                var _dataSource = new kendo.data.DataSource({
                    data: [],
                    schema: {
                        model: {
                            id: "APP_ID",
                            fields: {
                                APP_ID: { type: "number" },
                                SERVICE_OR_APPLICATION_NAME: { type: "string" }
                            }
                        }
                    },
                    pageSize: 10,
                    sort: { field: "APP_ID", dir: "asc" }
                });

                return {
                    dataSource: _dataSource,
                    columns: [
                        {
                            field: "APP_ID", title: "Applications ID", width: 120, template: function (data) {
                                return '<a href="#applications/' + data.APP_ID + '">' + data.APP_ID + '</a>';
                            }
                        },
                        { field: "SERVICE_OR_APPLICATION_NAME", title: "Applications Name" },
                        { field: "STATUS", title: "Status" }
                    ],
                    resizable: false,
                    scrollable: false,
                    sortable: {
                        mode: "single",
                        allowUnsort: false
                    },
                    pageable: {
                        pageSize: 10,
                        numeric: false,
                        input: true,
                        pageSizes: [10, 20, 30, 40, 50, 60, 70, 80],
                        refresh: false
                    }
                }
            };

            return model;
        }]);
    });
})();