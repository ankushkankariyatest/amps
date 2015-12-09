/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(["assetIt", "ajax-service"], function (app) {
        app.register.factory("siteExcelImportService", ["ajaxService", "configUrl", function (ajaxService, configUrl) {
            var _service = {};
            var siteUtilityUrl = configUrl.secureUrl + 'site';
            var dataUtilityUrl = configUrl.secureUrl + 'data';
            var logUtilityUrl = configUrl.secureUrl + 'logs';
            var exceptionUtilityUrl = configUrl.secureUrl + 'exception';
            var groupUtilityUrl = configUrl.secureUrl + 'group';
            _service.getSheetNameAndLatestVersion = function () {
                var _url = siteUtilityUrl + '/sheetNameAndVersion';
                var request = { method: "GET", url:_url };
                return ajaxService.httpSimulateGet(request);
            };
            _service.getGroupData = function (sheetName) {
                var _url = groupUtilityUrl + '/data/' + sheetName;
                var request = { method: "GET", url:_url };
                return ajaxService.httpSimulateGet(request);
            };
            _service.postGroupData = function (postData) {
                var _url = groupUtilityUrl + '/save';
                var request = { method: "POST", url:_url, data: postData };
                return ajaxService.httpSimulatePost(request);
            };
            _service.manualImport = function (postData) {
                var _url = dataUtilityUrl + '/import';
                var request = {
                    method: "GET",
                    url: _url,
                    params: {
                        userEmail: postData.userEmail
                    }
                };
                return ajaxService.httpSimulateGet(request);
            };
            _service.exceptionReportEmail = function (postData) {
                var _url = dataUtilityUrl + '/sendExceptionEmail';
                var request = {
                    method: "GET",
                    url: _url
                };
                return ajaxService.httpSimulateGet(request);
            };
            _service.manualImportUsers = function () {
                var _url = dataUtilityUrl + '/importUsers';
                var request = {
                    method: "GET",
                    url: _url,
                };
                return ajaxService.httpSimulateGet(request);
            };
            _service.getLogs = function () {
                var _url = logUtilityUrl;
                var request = { method: "get", url:_url};
                return ajaxService.httpSimulateGet(request);
            };
            _service.getLogDetails = function (startTime) {
                var _url = logUtilityUrl+ '/'+startTime;
                var request = { method: "get", url:_url};
                return ajaxService.httpSimulateGet(request);
            };
            _service.getLogRecords = function (startTime) {
                var _url = logUtilityUrl+ '/data/'+startTime;
                var request = { method: "get", url:_url};
                return ajaxService.httpSimulateGet(request);
            };
            _service.getExceptionRecords = function (startTime) {
                var _url = exceptionUtilityUrl+ '/data/'+startTime;
                var request = { method: "get", url:_url};
                return ajaxService.httpSimulateGet(request);
            };
            _service.savePrimaryKey = function (postData) {
                var _url = siteUtilityUrl+ '/primaryKey';
                var request = { method: "POST", url:_url, data: postData};
                return ajaxService.httpSimulatePost(request);
            };
            return _service;
        }]);
    });
})();
