/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 03/03/15
 * Time: 6:15 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt', 'ajax-service'], function (app) {
        app.register.factory("applicationService", ['ajaxService', 'configUrl' ,function (ajaxService, configUrl) {
            var _service = {};
            var _baseUrl = configUrl.secureUrl;
            _service.getAppRecords = function () {
                var parallelRequest = {
                    serviceName: 'application',
                    requests: [
                        { method: 'GET', url: 'mcps' },
                        { method: 'GET', url: 'apps' }
                    ]
                };
                return ajaxService.httpParrallelGet(parallelRequest);
            };
            _service.getAllApplicationFeedbackCount = function () {
                var request = { method: "GET", url: "feedback/count/application" };
                return ajaxService.http(request);
            };
            _service.getAllApplicationCertificationCount = function (context) {
                var request = { method: "GET", url: _baseUrl+"certification/count/"+context };
                return ajaxService.httpSimulateGet(request);
            };
            _service.certifyApplication = function (data) {
                var request = { method: "POST", url: _baseUrl+"certification/save", data: data };
                return ajaxService.httpSimulateGet(request);
            };
            _service.getCertifyApps = function (context, id) {
                var request = { method: "GET", url: _baseUrl+"certification/"+  context+"/"+id };
                return ajaxService.httpSimulateGet(request);
            };

            _service.getCertifyAppData = function (data) {
                var request = { method: "GET", url: _baseUrl+"certification/data", params:data };
                return ajaxService.httpSimulateGet(request);
            };
            _service.getUserPreferences = function (model) {
                var request = {
                    method: 'GET',
                    url: configUrl.secureUrl+'preference/get',
                    params: model
                };
                return ajaxService.httpSimulateGet(request);
            };
            return _service;
        }]);
    });
})();