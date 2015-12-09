/* file overview */
/* file name : processService.js */
/* factory name :- processService */
/* description:- it describes the various services for processes */
/* file overview */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("lobsServices", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            /*
             factory:processService
             method:getProcessList
             description: get process list service call
             */
            _service.getLobs = function () {
                var request = { method: "GET", url: "lobs" };
                return ajaxService.httpGet(request);
            };
            /*
             factory:processService
             method:getAppListByProcess
             description: get application list for a given process
             */
            _service.getAppListByLOBName = function (_request) {
                var request = {
                    method: "POST",
                    url: "lobs/apps",
                    data: _request
                };
                return ajaxService.httpPost(request);
            };
            /*
             factory:processService
             method:editProcess
             description: update process
             */
            _service.editLobs = function (_request) {
                var request = { method: "PUT", url: "lobs", data: _request };
                return ajaxService.httpPut(request);
            };

            _service.getAllLOBFeedbackCount = function () {
                var request = { method: "GET", url: "feedback/count/lob" };
                return ajaxService.http(request);
            };
            return _service;
        }]);
    });
})();