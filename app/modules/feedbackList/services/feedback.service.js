/* file overview */
/* file name : processService.js */
/* factory name :- processService */
/* description:- it describes the various services for processes */
/* file overview */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("feedbackListService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            /*
             factory:feedbackService
             method:getFeedbacks
             description: get all feedback list service call
             */
            _service.getFeedbacks = function () {
                var request = { method: "GET", url: "allfeedback" };
                return ajaxService.http(request);
            };
            
            return _service;
        }]);
    });
})();