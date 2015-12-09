/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('utilityModelGridConfigs', ['isMobileView','authenticationFactory', 'popupService', function (isMobileView, authenticationFactory, popupService) {
            var model = {};
            var appData ={};
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: []
                };
                _configs.scrollable = true;
                _configs.pageable = {
                    refresh: false,
                    input: true,
                    numeric: false,
                    pageSize: 20,
                    pageSizes: [20, 50, 100, 200]
                };
                _configs.groupable = false;
                _configs.columns = [];
                return _configs;
            };
            model.getDefaultFilterWithFilterText = function (searchText, _columns) {
                var q = $.trim(searchText);
                var filter = {
                    logic: "or",
                    filters: []
                };
                _.each(_columns, function(item){
                    if(item.field) {
                        if(isMobileView) {
                            if(filter.filters.length < 2) // TODO: Need to verify - We are only filtering on first 2 fields in mobile view
                                filter.filters.push({field: item.field, operator: "contains", value: q});
                        }else{
                            filter.filters.push({field: item.field, operator: "contains", value: q});
                        }
                    }
                });
                return filter;
            }
            model.getCipHistoryConfigs = function (onDataBound) {
                var _configs = {};
                _configs.dataBound = onDataBound,
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "version": {type: "Number"},
                                "createdBy": { type: "string" },
                                "createdAt": { type: "Date" },
                                "ROLE": { type: "string" },
                                "compareVersionKey" : {type: "Number"}
                            }
                        }
                    },
                    pageSize: 20,
                    sort: { field: "version", dir: "asc" }
                },
                    _configs.columns = [
                        {
                            field: "createdBy", title: "Created By", resizable: true, filterable: false, width: 100,

                        },
                        {
                            field: "createdAt",
                            title: "Created On",
                            resizable: true,
                            filterable: false,
                            template: function (data) {
                                return kendo.toString(new Date(data.createdAt), "F");
                            },
                            width: 90
                        },
                        {
                            field: "version",
                            title: "Version Detail",
                            resizable: true,
                            filterable: false,
                            template: function appTemplate(data) {
                                return '<a><span class="compareHistoty">' + data.version + '</span></a>'
                            },
                            width: 70,

                        },

                        {
                            title: "Compare with Other Version",
                            resizable: true,
                            filterable: false,
                            template: function appTemplate(data) {
                                var _template = '<div class="demo-section k-header">\
                                <select class = "versionSelectBox"> <option value="" disabled="disabled">Compare with ...</option></select>\
                                <button class="showhistoryComparePopup">Go</button></div>'
                                /*' <select kendo-drop-down-list\
                                 k-data-text-field="\'version\'"\
                                 k-data-value-field="]\'version\'"\
                                 k-data-source="cipHistoryConfig.dataSource.data"\
                                 style="width: 100%"></select>'*/
                                return _template;
                            },
                            width: 70
                        }
                    ];
                return _configs;
            };

            var _configs =  {};
            model.getTabConfigs = function (optionModel) {
                return _configs;
            };
            model.setTabConfigs = function (optionModel, data) {
                _configs =  {};
                angular.forEach(optionModel.dynamicGroups, function(item, index){
                    _configs[item.groupName] = {
                        text: item.groupName,
                        content: '<div site-general-details row-data="data.generalItem" cols="data.cols" group-data="data.groupsData" tab-title="' + item.groupName + '"></div>',
                        directiveRef: 'site-general-details-directive'
                    };
                });
                if(optionModel.showFeedback) {
                    _configs['Feedback'] = {
                        text: "Feedback",
                        content: '<div class="bca-feedback-con"><feedback-ticket context="{{data.sheetName | lowercase}}" app-id="{{data.title}}" update-feedback-count="updateFeedbackCount" no-work-order=true></feedback-ticket></div>',
                        directiveRef: 'FeedbackTicket'
                    };
                }
                if(optionModel.showHistory) {
                    _configs['History'] = {
                        text: "History",
                        content: '<div site-history row-data="data.rowData" cols="data.cols" keys="data.key" sheet-name="data.sheetName"></div>',
                        directiveRef: 'site-history-directive'
                    };
                }
                if(optionModel.showVersionComparer) {
                    _configs['Version Comparer'] = {
                        text: "Version Comparer",
                        content: '<div site-version-comparor row-data="data.rowData" cols="data.cols" keys="data.key" sheet-name="data.sheetName"></div>',
                        directiveRef: 'site-version-comparor-directive'
                    };
                }
            };

            return model;
        }]);
    });
})();