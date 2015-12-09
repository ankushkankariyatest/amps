(function () {
    "use strict";
    define(['assetIt', 'ajax-service', 'infrastructure-menu-model'], function (app) {
        app.register.factory('infrastructureService', ['configUrl', 'ajaxService', 'infrastructureModel', '$http',
            function (configUrl, ajaxService, infrastructureModel, $http) {
                var _service = {};
                _service.getServerList = function (data) {
                    var request = {
                        method: 'GET',
                        url: data != undefined ? 'servers?data=' + JSON.stringify(data) : 'servers'
                    };
                    if (configUrl.infraSimulate) {
                        request.url = configUrl.simulateServiceUrl + request.url;
                        return ajaxService.httpSimulateGet(request);
                    } else {
                        return ajaxService.httpGet(request);
                    }
                };

                _service.getServerData = function (serverId) {
                    var request = {
                        method: 'GET',
                        url: 'server/' + serverId
                    };
                    return ajaxService.httpGet(request);
                };

                _service.getDBList = function (data) {
                    var request = {
                        method: 'GET',
                        url: data != undefined ? 'dbs?data=' + JSON.stringify(data) : 'dbs'
                    };
                    if (configUrl.infraSimulate) {
                        request.url = configUrl.simulateServiceUrl + request.url;
                        return ajaxService.httpSimulateGet(request);
                    } else {
                        return ajaxService.httpGet(request);
                    }
                };
                _service.getMiddlewareList = function () {
                    var request = {
                        method: 'GET',
                        url: 'servers'
                    };
                    return ajaxService.httpGet(request);
                };
                _service.getServerApplicationDetails = function (instanceId) {
                    var request = {
                        method: 'GET',
                        url:'servers/apps/'+ instanceId
                    };

                    if (configUrl.infraSimulate) {
                        request.url = configUrl.simulateServiceUrl + request.url;
                        return ajaxService.httpSimulateGet(request);
                    } else {
                        return ajaxService.httpGet(request);
                    }
                };
                _service.getInfraWorkDetails = function (instanceId) {
                    var request = {
                        method: 'GET',
                        url:'infra/workorder/'+ instanceId
                    };

                    if (configUrl.infraSimulate) {
                        request.url = configUrl.simulateServiceUrl + request.url;
                        return ajaxService.httpSimulateGet(request);
                    } else {
                        return ajaxService.httpGet(request);
                    }
                };
                return  _service;
            }]);
    });
})();