/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 12:51 PM
 * To change this template use File | Settings | File Templates.
 */
(function() {
    "use strict";
    define(['assetIt', 'feedback-model', 'ajax-service'], function(app) {
        app.register.factory('feedbackService', ["$http",'$q', 'configUrl','feedbackModel', 'popupService','ajaxService', function($http, $q, configUrl, feedbackModel, popupService, ajaxService) {
            var services = {};
            services.sendFeedback = function(options, successFunction, errorFunction)
            {
                var _url = {
                    //ui :"feedback/ui",
                    ui :"ticket",
                    ticket: "ticket"
                };
                var request = { method: 'POST', url: _url[options], data: feedbackModel.getFeedbackModel() };
                var deferred = $q.defer();
                ajaxService.httpPost(request)
                    .then(function(data) {
                        deferred.resolve(popupService.showFeedbackSuccess());
                    },function(response, code) {
                        deferred.reject(popupService.showFeedbackError());
                    });
                return deferred.promise;
            }
            return services;
        }]);
    });
})();
