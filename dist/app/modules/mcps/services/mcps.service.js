!function(){"use strict";define(["assetIt","ajax-service"],function(t){t.register.factory("mcpsServices",["ajaxService","configUrl",function(e,r){var t={};return t.getMcps=function(){var t={method:"GET",url:"mcps"};return e.httpGet(t)},t.getAppListByProcess=function(t){var r={method:"GET",url:"mcps/"+t+"/apps"};return e.httpGet(r)},t.editProcess=function(t){var r={method:"PUT",url:"mcps",data:t};return e.httpPut(r)},t.getAllMCPFeedbackCount=function(){var t={method:"GET",url:"feedback/count/mcp"};return e.http(t)},t}])})}();