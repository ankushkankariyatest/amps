/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("enterpriseAccessService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            var enterpriseRequestUrl = configUrl.secureUrl + 'sendEnterpriseRequest';
            _service.sendEnterpriseAccessRequest = function(data){
                var request = { method: "post", url:enterpriseRequestUrl, data: data};
                return ajaxService.httpSimulatePost(request);
            };
            return _service;
        }]);
    });
})();
