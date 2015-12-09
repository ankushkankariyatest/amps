/* file overview */
/* file name : processService.js */
/* factory name :- processService */
/* description:- it describes the various services for processes */
/* file overview */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("mcpsServices", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            /*
             factory:processService
             method:getProcessList
             description: get process list service call
             */
            _service.getMcps = function () {
                var request = { method: "GET", url: "mcps" };
                return ajaxService.httpGet(request);
            };
            /*
             factory:processService
             method:getAppListByProcess
             description: get application list for a given process
             */
            _service.getAppListByProcess = function (code) {
                var request = {
                    method: "GET",
                    url: "mcps/" + code + "/apps"
                };
                return ajaxService.httpGet(request);
            };
            /*
             factory:processService
             method:editProcess
             description: update process
             */
            _service.editProcess = function (_request) {
                var request = { method: "PUT", url: "mcps", data: _request };
                return ajaxService.httpPut(request);
            };

            _service.getAllMCPFeedbackCount = function () {
                var request = { method: "GET", url: "feedback/count/mcp" };
                return ajaxService.http(request);
            };
            return _service;
        }]);
    });
})();