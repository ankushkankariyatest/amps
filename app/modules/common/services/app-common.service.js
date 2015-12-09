(function () {
    "use strict";
    define(['assetIt', 'ajax-service'], function (app) {
        app.register.factory("commonService", ['ajaxService', function (ajaxService) {
            var _service = {};
            _service.getAppVersion = function () {
                var request = { method: 'GET', url: 'version' }
                return ajaxService.http(request);
            }
            return _service;
        }]);
    });
})();