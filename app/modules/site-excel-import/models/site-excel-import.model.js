/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('siteExcelImportModelGridConfigs', ['isMobileView','authenticationFactory', function (isMobileView, authenticationFactory) {
            var model = {};
            var appData ={};
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: []
                };
                _configs.pageable = false;
                _configs.columns = [];
                return _configs;
            };
            model.getImportExelConfig = function () {
                var _configs = {};
                    _configs.groupable = false;
                    _configs.dataSource = {
                        data: [],
                        schema: {
                            model: {
                                fields: {
                                    "startTime": {type: "number"},
                                    "fileName": {type: "string"},
                                    "createdBy": { type: "string" },
                                    "endTime": { type: "number" },
                                    "numRecords": { type: "number" }
                                }
                            }
                        },
                        pageSize: 20
                        //sort: { field: "version", dir: "asc" }
                    };
                    _configs.columns = [
                        {
                            field: "startTime", title: "Date", resizable: true, filterable: false, width: 90, template: function(e) {
                                return new Date(e.startTime).toLocaleString();
                            }
                        },
                        {
                            field: "fileName", title: "File Name", resizable: true, filterable: false, width: 110
                        },
                        {
                            field: "createdBy", title: "User", resizable: true, filterable: false, width: 100
                        },
                        {
                            field: "endTime", title: "Processing Time", resizable: true, filterable: false, width: 100, template: function(e) {
                                return Math.ceil((e.endTime - e.startTime)/100) + " Seconds";
                            }
                        },
                        {
                            field: "numRecords", title: "Records Inserted", resizable: true, filterable: false, width: 100
                        }
                    ];
                return _configs;
            };
            model.getImportDetailConfig = function () {
                var _configs = {};
                _configs.groupable = false;
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "startTime": {type: "number"},
                                "endTime": { type: "number" },
                                "numRecords": { type: "number" },
                                "sheetName": {type: "string"},
                                "remarks": {type: "string"}
                            }
                        }
                    },
                    pageSize: 20
                    //sort: { field: "version", dir: "asc" }
                };
                _configs.columns = [
                    {
                        field: "startTime", title: "Date", resizable: true, filterable: false, width: 100, template: function(e) {
                            return new Date(e.startTime).toLocaleString();
                        }
                    },{
                        field: "endTime", title: "Processing Time", resizable: true, filterable: false, width: 100, template: function(e) {
                            return Math.ceil((e.endTime - e.startTime)/100) + " Seconds";
                        }
                    },{
                        field: "numRecords", title: "Records Inserted", resizable: true, filterable: false, width: 100
                    },{
                        field: "sheetName", title: "Sheet Name", resizable: true, filterable: false, width: 100
                    },{
                        field: "remarks", title: "Remarks", resizable: true, filterable: false, width: 100
                    }
                ];
                return _configs;
            };
            model.getImportDataConfig = function () {
                var _configs = {};
                _configs.groupable = false;
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "sheetName": {type: "string"},
                                "version": {type: "string"},
                                "recordData": {type: "string"},
                                "remark" : {type: "string"}
                            }
                        }
                    },
                    pageSize: 20
                    //sort: { field: "version", dir: "asc" }
                };
                _configs.columns = [
                    {
                        field: "sheetName", title: "Sheet Name", resizable: true, filterable: false, width: 100
                    },{
                        field: "version", title: "Version", resizable: true, filterable: false, width: 100
                    },
                    {
                        field: "recordData", title: "Record", resizable: true, filterable: false, width: 100,
                        template: function (data) {
                            var tmpl = '';
                            _.each(_.keys(data.recordData), function(item){
                                if('parent' != item && typeof(item) != 'function' && 'uid' != item && '_events' != item)
                                    tmpl+= '<strong>' + item + ':</strong> ' + data.recordData[item] + '   ';
                            });
                            return tmpl;
                        }
                    },
                    {
                        field: "remark", title: "Remarks", resizable: true, filterable: false, width: 100,
                        template: function (data) {
                            if(data.version == 1){
                                return '<span class="info"> Added </span></a>';
                            }
                            else if(data.isRemoved){
                                return '<span class="info"> Removed </span></a>';
                            }else{
                                return '<span class="info"> Modified </span></a>';

                            }
                        }
                    }
                ];
                return _configs;
            };
            model.getExceptionDataConfig = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    sort: { field: "order", dir: "asc" }
                };
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

            var _configs =  {};
            model.getTabConfigs = function (optionModel) {
                return _configs;
            };
            model.setTabConfigs = function (optionModel, data) {
                _configs =  {};

                _configs['Detail'] = {
                    text: "Detail",
                    content: '<div excel-import-details start-time="data.startTime"></div>',
                    directiveRef: 'excel-import-details-directive'
                };

                _configs['Data'] = {
                    text: "Data",
                    content: '<div excel-import-data start-time="data.startTime"></div>',
                    directiveRef: 'excel-import-data-directive'
                };

                angular.forEach(optionModel.dynamicGroups, function(item, index){
                    _configs['ERR: ' + item.displayName] = {
                        text: 'ERR: ' + item.displayName,
                        content: '<div excel-import-exception exception-data="data.data" key="' + item['_id'] + '" start-time="data.startTime"></div>',
                        directiveRef: 'excel-import-exception-directive'
                    };
                });
            };

            return model;
        }]);
    });
})();