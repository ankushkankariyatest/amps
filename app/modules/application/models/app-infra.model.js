(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('appInfraModel', function () {
            var serviceApiOptions = {
                server: 'server',
                database: 'database',
                middleware: 'middleware'
            };
            var _infrastructureModel = { appId: '', type: '' };

            var _infrastructureEnvironmentDetailModel = { instanceId: '' };

            var _infrastructure = {};
            _infrastructure.initializeModel = function () {
                return { appId: '', type: '' };
            };
            _infrastructure.getModel = function () {
                return _infrastructureModel;
            };
            _infrastructure.setModel = function (model) {
                angular.extend(_infrastructureModel, model);
            };
            var tabData = {}; // Local object to capture the service response
            _infrastructure.getTabData = function(key, identifier){
                return tabData[key + identifier];
            };
            _infrastructure.setTabData = function(key, identifier, val){
                tabData[key + identifier] = val;
            };
            _infrastructure.setEnvDetailData = function (model) {
                _infrastructureEnvironmentDetailModel.instanceId = model.RELAsset_Instance_ID;
            };
            _infrastructure.getEnvDetailData = function () {
                var infraTabAPIs = {
                    server: { type: 'Server', serviceAlias: 'server', instanceId: '' },
                    database: { type: 'database', serviceAlias: 'db', instanceId: '' },
                    middleware: { type: 'middleware', serviceAlias: 'middleware', instanceId: '' }
                };
                var activeInfo = infraTabAPIs[_infrastructureModel.type];
                activeInfo.instanceId = _infrastructureEnvironmentDetailModel.instanceId;
                return activeInfo;
            };

            _infrastructure.getActiveInfrastructureTab = function () {
                var _baseAppInfraPath = 'app/modules/application/templates/app-infra-wrapper-tab/';
                var allTabs = {
                    server: { name: 'Server', id: 'Tab1', view: _baseAppInfraPath + 'app-infra-server.html' },
                    database: { name: 'Database', id: 'Tab2', view: _baseAppInfraPath + 'app-infra-database.html' },
                    middleware: { name: 'Middleware', id: 'Tab3', view: _baseAppInfraPath + 'app-infra-middleware.html' }
                };
                return { activeTab: allTabs[_infrastructureModel.type] };
            }

            _infrastructure.getActiveInfraTabAPIs = function () {
                var infraTabAPIs = {
                    server: { name: 'Server', infraTypeServiceAlias: 'server', serviceAlias: 'server' },
                    database: { name: 'database', infraTypeServiceAlias: 'server', serviceAlias: 'db' },
                    middleware: { name: 'middleware', infraTypeServiceAlias: 'middleware', serviceAlias: 'middleware' }
                };
                var activeInfo = infraTabAPIs[_infrastructureModel.type];
                activeInfo.info = _infrastructureModel;

                return activeInfo;
            }

            return _infrastructure;
        });
    });
})();