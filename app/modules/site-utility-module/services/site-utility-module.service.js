/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("siteUtilityModuleServices", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            var _baseUrl =  'site';

            _service.loadUtilityData = function (reqModel) {
                var _url = _baseUrl+"/"+reqModel.sheetName;
                var request = {
                    method: "GET",
                    url:_url,
                    params: {
                        user: reqModel.user
                    }
                };
                return ajaxService.httpAuthGet(request);
            };
            _service.getUtilityInfo = function () {
                var _url =  _baseUrl+ '/sheetNameAndVersion';
                var request = { method: "GET", url:_url };
                return ajaxService.httpAuthGet(request);
            };
            _service.getHistoryData = function (model){
                var _url = configUrl.secureUrl + "site/history";
                var request = { method: "POST", url:_url, data: model};
                return ajaxService.httpSimulatePost(request);
            };
            _service.getUserPreferences = function (model) {
                var request = {
                    method: 'GET',
                    url: configUrl.secureUrl+'preference/get',
                    params: model
                };
                return ajaxService.httpSimulateGet(request);
            };

            _service.addUserPreferences = function (model) {
                var request = {
                    method: 'POST',
                    url: configUrl.secureUrl+'preference/save',
                    data: model
                };
                return ajaxService.httpSimulatePost(request);
            };

            _service.updateUserPreferences = function (model) {
                var request = {
                    method: 'POST',
                    url: configUrl.secureUrl+'preference/multiSave',
                    data: model
                };
                return ajaxService.httpSimulatePost(request);
            };
            /* Watch List*/
            _service.addUserWatchList = function (model) {
                var request = {
                    method: 'POST',
                    url: configUrl.secureUrl + 'watchList/add',
                    data: model
                };
                return ajaxService.httpSimulatePost(request);
            };
            _service.removeUserWatchList = function (model) {
                var request = {
                    method: 'POST',
                    url: configUrl.secureUrl + 'watchList/remove',
                    data: model
                };
                return ajaxService.httpSimulatePost(request);
            };
            return _service;
        }]);
    });
})();