!function(){"use strict";define(["assetIt","ajax-service"],function(e){e.register.factory("auditLogsService",["ajaxService","configUrl",function(t,r){var e={},i=r.secureUrl+"adminLogs";return e.getLogs=function(){var e={method:"get",url:i};return t.httpSimulatePost(e)},e}])})}();