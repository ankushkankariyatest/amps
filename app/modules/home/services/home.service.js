/**
 * Created with IntelliJ IDEA.
 * User: ankush@wizni.com
 * Date: 03/12/15
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
(function(){
    "use strict";
    define(['assetIt', 'ajax-service'],function(app){
        app.register.factory("homeService", ["$http",'configUrl', 'ajaxService',  function($http, configUrl, ajaxService){
            var _service = {};
            _service.getAppData = function (successFn) {
                var parallelRequest = {
                    serviceName: 'home',
                    requests: [
                        { method: 'GET', url: 'mcps' },
                        { method: 'GET', url: 'search/apps' },
                        { method: 'GET', url: 'lobs' },
                    ]
                };
                var appData = {};
                var sendData = function(data) {
                    angular.extend(appData, data);
                    if(Object.keys(appData).length > 3) {
                        successFn(appData);
                    }
                };
                ajaxService.httpParrallelGet(parallelRequest)
                .then(function (response) {
                    sendData({ mcps: response[0], apps: response[1], lobs: response[2] });
                });
                ajaxService.http({
                    method:'GET', url: 'count'
                }).then(function(response) {
                    sendData({count: response});
                });
            }
            
            //TODO: Delete below code after verification
//            _service.getCount = function(successFn){
//                var request = { method:'GET', url: 'count' }
//                blockUI.start();
//                ajaxService.httpGet(request)
//                    .then(function(response){
//                        blockUI.stop();
//                        successFn(response);
//                    });
//            }
//            _service.getApps = function(successFn){
//                var request = { method:'GET', url: 'search/apps' }
//                blockUI.start();
//                ajaxService.httpGet(request)
//                    .then(function(response){
//                        blockUI.stop();
//                        successFn(response);
//                    });
//            }
//            _service.getMCPs = function(successFn){
//                var request = { method:'GET', url: 'mcps' }
//                blockUI.start();
//                ajaxService.httpGet(request)
//                    .then(function(response){
//                        blockUI.stop();
//                        successFn(response);
//                    });
//            }
//            _service.getLOBs = function(successFn){
//                var request = { method:'GET', url: 'lobs' }
//                blockUI.start();
//                ajaxService.httpGet(request)
//                    .then(function(response){
//                        blockUI.stop();
//                        successFn(response);
//                    });
//            }
            return  _service;
        }]);
    });
})();