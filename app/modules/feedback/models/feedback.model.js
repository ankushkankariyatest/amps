/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 11:36 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt', 'authentication-factory'], function (app) {
        app.register.factory('feedbackModel', ['authenticationFactory', '$location', function (authenticationFactory, $location) {
                var feedbackModel = {
                    email: authenticationFactory.getUserName(),
                    mood: "Happy",
                    message: '',
                    context: '',
                    id: '9999',
                    page: $location.absUrl(),
                    status: 'submitted',
                    fileUpload: {
                        data: '',
                        name: ''
                    }
                };
                var dropdownValues = [
                    "APPLICATION",
                    "MCP",
                    "LOB",
                    "INFRASTRUCTURE",
                    "BCA Inventory"
                ];
                /*// Hide "Infrastructure" option for users with no "enterprise" access
                if(authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.enterprise) === -1){
                    dropdownValues = $.grep(dropdownValues, function(item,index){
                        return item !== 'INFRASTRUCTURE';
                    });
                }*/

                var feedback = {};
                feedback.initializeFeedback = function () {
                    return {
                        email: authenticationFactory.getUserName(),
                        mood: "Happy",
                        message: '',
                        id: '9999',
                        context: '',
                        page: $location.absUrl(),
                        status: 'submitted',
                        fileUpload: {
                            data: '',
                            name: ''
                        }
                    };
                };
                feedback.getFeedbackModel = function ()
                {
                    return feedbackModel;
                };
                feedback.getDropdown = function ()
                {
                    return dropdownValues;
                };
                feedback.setFeedbackModel = function (model)
                {
                    feedbackModel = model;
                };
                feedback.getEmail = function ()
                {
                    return feedbackModel.email;
                };
                feedback.getMood = function ()
                {
                    return feedbackModel.mood;
                };
                feedback.getMessage = function ()
                {
                    return feedbackModel.message;
                };
                feedback.getContext = function ()
                {
                    return feedbackModel.context;
                };
                return feedback;
            }]);
    });
})();
