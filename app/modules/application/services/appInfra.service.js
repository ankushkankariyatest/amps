(function () {
    "use strict";
    define(['assetIt', 'ajax-service', 'appInfra-model'], function (app) {
        app.register.factory('appInfraService', ['configUrl', 'ajaxService', 'appInfraModel', '$http',
            function (configUrl, ajaxService, infrastructureModel, $http) {
                var _service = {};
                var baseUrl = configUrl.infraSimulate ? configUrl.simulateServiceUrl : '';
                _service.createInfrastructureTypeView = function () {
                    var requestModel = infrastructureModel.getActiveInfraTabAPIs();
                    var request = {};
                    request = {
                            method: 'GET',
                            url: baseUrl + 'apps/' + requestModel.info.appId + '/server'
                        };

                    if(requestModel.infraTypeServiceAlias == 'middleware'){
                        request.url = baseUrl + 'apps/middleware/' + requestModel.info.appId; // Different endpoint for middleware
                    }

                    if(configUrl.infraSimulate)
                        return ajaxService.httpSimulateGet(request);

                    return ajaxService.httpGet(request);
                };

                _service.getActiveInfraDetailsByEnvironment = function () {
                    var requestModel = infrastructureModel.getEnvDetailData();
                    var request = {
                        method: 'GET',
                        url: requestModel.serviceAlias + '/' + requestModel.instanceId
                    };
                    return ajaxService.httpGet(request);
                    //return ajaxService.httpSimulateGet(request);
                };

                _service.createInfraEnvironmentView = function (key) {
                    var request = {
                        method: 'GET',
                        url: baseUrl + 'apps/' + key + '/infrastructure'
                    };
                    if(configUrl.infraSimulate)
                        return ajaxService.httpSimulateGet(request);

                    return ajaxService.httpAlwaysServerGet(request);
                };


                _service.getInfraDetailsByEnvironment = function (instanceId) {
                    var request = {
                        method: 'GET',
                        url: 'server/' + instanceId
                    };
                    return ajaxService.httpGet(request);
                };

                _service.insertOnboardingInfo = function (data) {
                    var request = { method: "POST", url: "onboardingInfo/data", data: data };
                    return ajaxService.http(request);
                };
                _service.getInfraPendingApprovalView = function (instanceId) {
                    var request = {
                        method: 'GET',
                        url: 'onboarding/' + instanceId
                    };
                    return ajaxService.httpGet(request);
                };

                return _service;
            }]);
    });
})();