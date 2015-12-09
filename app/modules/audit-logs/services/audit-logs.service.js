/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("auditLogsService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            var auditLogsRequestUrl = configUrl.secureUrl + 'adminLogs';
            _service.getLogs = function(){
                var request = { method: "get", url:auditLogsRequestUrl};
                return ajaxService.httpSimulatePost(request);
            };
            return _service;
        }]);
    });
})();
