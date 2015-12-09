(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("certificationListService", ["ajaxService",  "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            _service.getCertifications = function () {
                var _url = configUrl.secureUrl + "certification";
                var request = { method: "GET", url: _url};
                return ajaxService.httpSimulateGet(request);
            };
            _service.getCertifyAppData = function (data) {
                var _url = configUrl.secureUrl + "certification/data";
                var request = { method: "GET", url: _url,  params: data };
                return ajaxService.httpSimulateGet(request);
            };
            return _service;
        }]);
    });
})();