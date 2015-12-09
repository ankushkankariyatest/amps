(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('appConfig', ['isMobileView','authenticationFactory', function (isMobileView, authenticationFactory) {
            var model = {};
            var appData ={};
            model.getConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "APP_ID": { type: "string" },
                                "SERVICE_OR_APPLICATION_NAME": { type: "string" },
                                "LINE_OF_BUSINESS": { type: "string" },
                                "IT_CORE_SERVICE": { type: "string" },
                                "PROCESS": { type: "string" },
                                "INFORMATION_CLASSIFICATION": { type: "string" },
                                "DESIGN_TIER": { type: "string" },
                                "MANAGED_BY": { type: "string" },
                                "ASSET_TYPE": { type: "string" },
                                "IT_DIRECTOR": { type: "string" },
                                "CLIENT_OWNER": { type: "string" },
                                "CLIENT_RPO": { type: "string" },
                                "CLIENT_RTO": { type: "string" },
                                "NETWORK": { type: "string" },
                                "IT_GROUP": { type: "string" },
                                "PRIMARY_DC": { type: "string" },
                                "SECONDARY_DC": { type: "string" },
                                "ASSET_DESCRIPTION": { type: "string" },
                                "IT_SME": { type: "string" },
                                "ONBOARD_FLAG": { type: "string" },
                                "SERVICE_OR_APPLICATION_ACRONYM": { type: "string" },
                                "DISPLAY_NAME": { type: "string" },
                                "IT_SME_BU": { type: "string" },
                                "STATUS": { type: "string" }
                            }
                        }
                    },
                    pageSize: 20,
                    sort: { field: "SERVICE_OR_APPLICATION_NAME", dir: "asc" }
                };
                _configs.scrollable = true;
                _configs.columns = [
                            {
                                field: "SERVICE_OR_APPLICATION_NAME", title: "Applications", resizable: true, filterable: false, width: 450,
                                groupable: false,
                                template: function (data) {
                                    var info = (null != data.SERVICE_OR_APPLICATION_NAME) ? data.SERVICE_OR_APPLICATION_NAME : '';
                                    return '<span class="info">' + info + '</span><a class="permalink-wrapper" style="display:none;" attr-base="applications" attr-permalink-key="' + data.APP_ID + '"><span class="icon-link"></span></a>';
                                }
                            },
                            {
                                field: "PROCESS", title: "MCPs", width: 150, resizable: true, filterable: false,
                                groupable: false,
                                template: function (data) {
                                    var _temp = '';
                                    if (data.processInfo.length > 1) {
                                        _temp = '<a class="processLinkMultiple"><i>' + data.modifiedProcessValue + ' [' + data.processInfo.length + '] </i></a>';
                                    } else {
                                     if(  data.modifiedProcessValue && data.modifiedProcessValue!=null){
                                         var _desc = data.processInfo[0] && data.processInfo[0].DESCRIPTION && data.processInfo[0].DESCRIPTION!=null?data.processInfo[0].DESCRIPTION:"";
                                        _temp = '<a class="processLink" href="#/mcps/' + data.modifiedProcessValue + '" data-multiple="false" title="' + _desc + '" data-toggle="tooltip">' + data.modifiedProcessValue + '</a>'
                                     }
                                    }
                                    return _temp;
                                }
                            },
                            {
                                field: "LINE_OF_BUSINESS", title: "LOBs", width: 250, resizable: true, filterable: false,
                                groupable: false,
                                template: function (data) {
                                    var _temp = '';
                                    if (data.lobInfo.length > 1) {
                                        _temp = '<a class="lobLinkMultiple"><i>' + data.modifiedLobValue + ' [' + data.lobInfo.length + '] </i></a>'
                                    } else {
                                        _temp = '<a class="lobLink" href="#/lobs?name=' + data.modifiedLobValue + '" data-multiple="false">' + data.modifiedLobValue + '</a>';
                                    }
                                    return _temp;
                                }
                            },
                            { field: "IT_CORE_SERVICE", title: "IT Core Service Group", resizable: true, filterable: false , groupable: false},
                            /*{ field: "IT_DIRECTOR", hidden: true, groupHeaderTemplate: "IT Director: #= value # (Count: #= count#)"},
                            { field: "CLIENT_OWNER", hidden: true, groupHeaderTemplate: "Client Owner: #= value # (Count: #= count#)" },
                            { field: "CLIENT_RPO", hidden: true, groupHeaderTemplate: "Client RPO: #= value # (Count: #= count#)" },
                            { field: "BIA_TIER", hidden: true, groupHeaderTemplate: "BIA Tier: #= value # (Count: #= count#)" },
                            { field: "IT_GROUP", hidden: true, groupHeaderTemplate: "IT Group: #= value # (Count: #= count#)" },
                            { field: "PRIMARY_DC", hidden: true, groupHeaderTemplate: "Primary DC: #= value # (Count: #= count#)" },
                            { field: "SECONDARY_DC", hidden: true, groupHeaderTemplate: "Secondary DC: #= value # (Count: #= count#)" },
                            */{
                                field: "STATUS", title: "Status", width: 120, resizable: true, groupable: false, filterable: {
                                    ui: function (element) {
                                        var data = ["Active", "Retired", "In-flight Project"];
                                        element.kendoDropDownList({
                                            dataSource: data,
                                            optionLabel: "--Select Value--"
                                        });
                                    }
                                }
                            },
                            /*{
                                field: "COUNT", title: "Feedback", resizable: true, filterable: false, template: function appTemplate(data) {
                                    return '<span class="comment_count ' + (data.COUNT ? "" : "hide") + '"> <i class="icon-caret-down"></i> <span class="feedbackCount' + data.APP_ID + '">' + data.COUNT + '</span></span>'
                                }, width: 70
                            },
                            {
                                field: "CertificationCount", title: "Certification", resizable: true, filterable: false, template: function appTemplate(data) {
                                return '<span class="certified_count ' + (data.CertificationCount ? "" : "hide") + '" title="Certified"><span class="certificationCount' + data.APP_ID + '">' + data.CertificationCount + '</span></span>' +
                                    '<span class="rejected_count ' + (data.CertificationRejectCount ? "" : "hide") + '" title="Rejected"><span class="certificationCount' + data.APP_ID + '">' + data.CertificationRejectCount + '</span></span>'
                                }, width: 110
                            },*/
                            {
                                 title: "Actions", resizable: true, filterable: false, groupable: false, template: function appTemplate(data) {
                                     /*return '<div class="btn-group">\
                                        <a data-toggle="dropdown" class="multiple-action-dropdown" type="button" title="Actions"></a>\
                                        <ul class="dropdown-menu">\
                                            <i class="icon-right-arrow"></i>\
                                            <li><a class="bacr">Certify</a></li>\
                                            <li><a class="systemInfo">Onboard</a></li>\
                                        </ul>\
                                    </div>'*/
                                return '<span class="bacr icon-captured">Certify</span>';
                                },
                                 width: 90,
                                 attributes: {
                                     "class": "action-column"
                                 }
                            }
                ];

                _configs.routeParamFilter = function (id) {
                    return { field: "APP_ID", operator: "eq", value: parseInt(id) }
                }
                _configs.getDefaultFilterWithFilterText = function (searchText) {
                    var q = $.trim(searchText);
                    var fltr = {
                        logic: "or",
                        filters:
                            [
                                    { field: "SERVICE_OR_APPLICATION_NAME", operator: "contains", value: q },
                                    { field: "LINE_OF_BUSINESS", operator: "contains", value: q },
                                    { field: "IT_CORE_SERVICE", operator: "contains", value: q },
                                    { field: "PROCESS", operator: "contains", value: q },
                                    { field: "INFORMATION_CLASSIFICATION", operator: "contains", value: q },
                                    { field: "DESIGN_TIER", operator: "contains", value: q },
                                    { field: "MANAGED_BY", operator: "contains", value: q },
                                    { field: "IT_LEAD", operator: "contains", value: q },
                                    { field: "ASSET_TYPE", operator: "contains", value: q },
                                    { field: "IT_DIRECTOR", operator: "contains", value: q },
                                    { field: "CLIENT_OWNER", operator: "contains", value: q },
                                    { field: "CLIENT_RPO", operator: "contains", value: q },
                                    { field: "CLIENT_RTO", operator: "contains", value: q },
                                    { field: "NETWORK", operator: "contains", value: q },
                                    { field: "IT_GROUP", operator: "contains", value: q },
                                    { field: "PRIMARY_DC", operator: "contains", value: q },
                                    { field: "SECONDARY_DC", operator: "contains", value: q },
                                    { field: "ASSET_DESCRIPTION", operator: "contains", value: q },
                                    { field: "IT_SME", operator: "contains", value: q },
                                    { field: "ONBOARD_FLAG", operator: "contains", value: q },
                                    { field: "SERVICE_OR_APPLICATION_ACRONYM", operator: "contains", value: q },
                                    { field: "DISPLAY_NAME", operator: "contains", value: q },
                                    { field: "IT_SME_BU", operator: "contains", value: q },
                                    { field: "STATUS", operator: "contains", value: q }
                            ]
                    };
                    if(isMobileView) {
                        fltr.filters = [
                            { field: "SERVICE_OR_APPLICATION_NAME", operator: "contains", value: q },
                            { field: "LINE_OF_BUSINESS", operator: "contains", value: q },
                            { field: "IT_CORE_SERVICE", operator: "contains", value: q },
                            { field: "PROCESS", operator: "contains", value: q },
                            { field: "STATUS", operator: "contains", value: q },
                        ]
                    }
                    if(!isNaN(q)) {
                        fltr.filters.push({ field: "APP_ID", operator: "eq", value: parseInt(q) });
                    }
                    return fltr;
                }
                return _configs;
            };

            model.getBacrConfigs = function () {
                var _configs = {};
                _configs.dataSource = {
                    data: [],
                    schema: {
                        model: {
                            fields: {
                                "version": {type: "Number"},
                                "createdBy": { type: "string" },
                                "createdOn": { type: "Number" },
                                "status": { type: "string" }
                            }
                        }
                    },
                    pageSize: 20,
                    sort: { field: "createdOn", dir: "desc" }
                },
                    _configs.columns = [
                        {
                            field: "version", title: "Version", resizable: true, filterable: false, width: 100,

                        },{
                            field: "createdBy", title: "Email", resizable: true, filterable: false, width: 250,

                        },{
                            field: "createdOn", title: "Date", resizable: true, filterable: false, template: function (data) {
                                return kendo.toString(new Date(data.createdOn), "F");
                            }, width: 90
                        },
                       /* {
                            field: "ROLE", title: "Role", resizable: true, filterable: false, width: 100

                        },*/
                        {
                            field: "status", title: "Status", resizable: true, filterable: false, width: 150, template: function (data) {
                                return data.status ? "<span><i class='icon_certified_count'></i>Certified</span>" : "<span><i class='icon_rejected_count'></i>Rejected</span>";
                            }
                        },
                        {
                            title: "View", resizable: true, filterable: false, template: function appTemplate(data) {
                            return '<span class="appBacr icon-captured"></span>'
                        },
                            width: 90
                        }
                    ];
                return _configs;
            };

            model.setApplication = function(appInfo) {
                for(var key in appInfo) {
                    if (typeof appInfo[key] != 'function' && key != 'uid'  && key != '_events' && key != 'dirty' && appInfo.hasOwnProperty(key)) {
                        if(key == 'processInfo' || key == 'lobInfo') {
                            appData[key]={};
                            for(var proKey in appInfo[key]) {
                                if (typeof appInfo[key][proKey] != 'function'  && proKey != '_events' && appInfo[key].hasOwnProperty(proKey)) {
                                    appData[key][proKey] = appInfo[key][proKey];
                                    for(var i in appData[key][proKey]) {
                                        if (typeof appInfo[key][proKey][i] == 'function'  || i == '_events' || i == 'uid'|| i == '$$hashKey' || !appInfo[key][proKey].hasOwnProperty(i)) {
                                            delete appInfo[key][proKey][i];
                                        }
                                    }
                                }
                            }
                        } else {
                            appData[key] = appInfo[key];
                        }
                    }
                }
            };
            model.getApplication = function() {
                return appData;
            };
            model.clearApplication = function() {
                appData={};
            };
            model.updateInfra = function(data) {
                appData['INFRASTRUCTURE']=data;
            };
            model.getCustomGroupConfigureData = function(){
                var _data = [
                    {field: "IT_DIRECTOR", title: "IT DIRECTOR", name: 'IT_DIRECTOR'},
                    {field: "CLIENT_OWNER", title: "CLIENT OWNER", name: "CLIENT_OWNER"},
                    {field: "CLIENT_RPO", title: "CLIENT RPO", name: "CLIENT_RPO"},
                    {field: "BIA_TIER", title: "BIA Tier", name: "BIA Tier"},
                    {field: "IT_GROUP", title: "IT GROUP", name: "IT_GROUP"},
                    {field: "PRIMARY_DC", title: "PRIMARY DC", name: "PRIMARY_DC"},
                    {field: "SECONDARY_DC", title: "SECONDARY DC", name: "SECONDARY_DC"},
                    {field: "IT_LEAD", title: "IT LEAD", name: "IT_LEAD"}
                ];
                return _data;

            }
            return model;
        }]);
    });
})();