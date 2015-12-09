/**
 * Created by wizdev on 8/3/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("versionService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            var _comparerBasePath = configUrl.secureUrl + 'site';

            _service.getSheetNameAndLatestVersion = function () {
                var _url = _comparerBasePath + '/sheetNameAndVersion';
                var request = { method: "GET", url:_url };
                return ajaxService.httpSimulateGet(request);
            };

            _service.getSheetData = function (model) {
                var _url = _comparerBasePath + '/' + model.sheet + '/' + model.fromVersion + '/' + model.toVersion;
                var request = { method: "GET", url:_url };
                return ajaxService.httpSimulateGet(request);
            };
            _service.getImportRecord = function (model) {
                var _url = _comparerBasePath + "/" + model.sheetName + "/" + model.startTime;
                var request = { method: "GET", url:_url };
                return ajaxService.httpAsyncSimulateGet(request);
            };
            _service.getDiffData = function (model) {
                var _url = _comparerBasePath + "/diff";
                var request = {
                    method: 'POST',
                    url: _url,
                    data: model
                };

                return ajaxService.httpAsyncSimulatePost(request);
            };
            return _service;
        }]);
    });
})();
