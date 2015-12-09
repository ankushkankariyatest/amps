!function(){"use strict";define(["assetIt"],function(e){e.register.factory("utilityModelGridConfigs",["isMobileView","authenticationFactory","popupService",function(a,i,r){var e={};e.getConfigs=function(){var e={};return e.dataSource={data:[]},e.scrollable=!0,e.pageable={refresh:!1,input:!0,numeric:!1,pageSize:20,pageSizes:[20,50,100,200]},e.groupable=!1,e.columns=[],e},e.getDefaultFilterWithFilterText=function(i,r){var t=$.trim(i),e={logic:"or",filters:[]};return _.each(r,function(i){i.field&&(a?e.filters.length<2&&e.filters.push({field:i.field,operator:"contains",value:t}):e.filters.push({field:i.field,operator:"contains",value:t}))}),e},e.getCipHistoryConfigs=function(t){var e={};return e.dataBound=t,e.dataSource={data:[],schema:{model:{fields:{version:{type:"Number"},createdBy:{type:"string"},createdAt:{type:"Date"},ROLE:{type:"string"},compareVersionKey:{type:"Number"}}}},pageSize:20,sort:{field:"version",dir:"asc"}},e.columns=[{field:"createdBy",title:"Created By",resizable:!0,filterable:!1,width:100},{field:"createdAt",title:"Created On",resizable:!0,filterable:!1,template:function(e){return kendo.toString(new Date(e.createdAt),"F")},width:90},{field:"version",title:"Version Detail",resizable:!0,filterable:!1,template:function(e){return'<a><span class="compareHistoty">'+e.version+"</span></a>"},width:70},{title:"Compare with Other Version",resizable:!0,filterable:!1,template:function(t){var e='<div class="demo-section k-header">                                <select class = "versionSelectBox"> <option value="" disabled="disabled">Compare with ...</option></select>                                <button class="showhistoryComparePopup">Go</button></div>';return e},width:70}],e};var t={};return e.getTabConfigs=function(e){return t},e.setTabConfigs=function(e,a){t={},angular.forEach(e.dynamicGroups,function(e,a){t[e.groupName]={text:e.groupName,content:'<div site-general-details row-data="data.generalItem" cols="data.cols" group-data="data.groupsData" tab-title="'+e.groupName+'"></div>',directiveRef:"site-general-details-directive"}}),e.showFeedback&&(t.Feedback={text:"Feedback",content:'<div class="bca-feedback-con"><feedback-ticket context="{{data.sheetName | lowercase}}" app-id="{{data.title}}" update-feedback-count="updateFeedbackCount" no-work-order=true></feedback-ticket></div>',directiveRef:"FeedbackTicket"}),e.showHistory&&(t.History={text:"History",content:'<div site-history row-data="data.rowData" cols="data.cols" keys="data.key" sheet-name="data.sheetName"></div>',directiveRef:"site-history-directive"}),e.showVersionComparer&&(t["Version Comparer"]={text:"Version Comparer",content:'<div site-version-comparor row-data="data.rowData" cols="data.cols" keys="data.key" sheet-name="data.sheetName"></div>',directiveRef:"site-version-comparor-directive"})},e}])})}();