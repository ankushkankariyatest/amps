/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("splashConfigurationService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            _service.getAnnouncements = function(){
               var request = { method: "get", url:configUrl.authServiceUrl + 'announcement'};
                return ajaxService.httpSimulateGet(request);
            };
            _service.saveAnnoucements = function(data){
                var request = { method: "post", url:configUrl.secureUrl + 'announcement', data: data};
                 return ajaxService.httpSimulatePost(request);
            };
            return _service;
        }]);
    });
})();
