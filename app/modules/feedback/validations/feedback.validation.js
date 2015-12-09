/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 11:47 PM
 * To change this template use File | Settings | File Templates.
 */
(function() {
    "use strict";
    define(['assetIt', 'feedback-model', 'validation-util'], function(app) {
        app.register.factory('feedbackValidation', ['feedbackModel','validations', function(feedbackModel, validations)
        {
            var defaultErrorInfo = {isValid: true, message: ''};

            var feedbackDefaultError  = {
                isValid:true,
                email:defaultErrorInfo,
                mood: defaultErrorInfo,
                subject: defaultErrorInfo,
                message: defaultErrorInfo,
                context: defaultErrorInfo
            };

            var feedback = {};
            feedback.isValidFeedbackForm = function(subject)
            {
                var email = feedbackModel.getEmail();
                var mood = feedbackModel.getMood();
                var message = feedbackModel.getMessage();
                var context = feedbackModel.getContext();

                var formInfo = angular.extend({}, feedbackDefaultError);

                var invalidEmail = validations.isValidEmail(email);
                if(!invalidEmail.isValid)
                {
                    formInfo.isValid = invalidEmail.isValid;
                    formInfo.email = invalidEmail;
                }
                
                var isMoodEmpty = validations.isNotEmpty(mood);
                if(!isMoodEmpty.isValid)
                {
                    formInfo.isValid = isMoodEmpty.isValid;
                    formInfo.mood = isMoodEmpty;
                }
                
                var isSubjectEmpty = validations.isNotEmpty(subject);
                if(!isSubjectEmpty.isValid)
                {
                    formInfo.isValid = isSubjectEmpty.isValid;
                    formInfo.subject = isSubjectEmpty;
                }
                
                var isContextEmpty = validations.isNotEmpty(context);
                if(subject=="ticket" && !isContextEmpty.isValid)
                {
                    formInfo.isValid = isContextEmpty.isValid;
                    formInfo.context = isContextEmpty;
                }
                
                var isMessageEmpty = validations.isNotEmpty(message);
                if(!isMessageEmpty.isValid)
                {
                    formInfo.isValid = isMessageEmpty.isValid;
                    formInfo.message = isMessageEmpty;
                }
                return formInfo;
            }
            return feedback;
        }]);
    });
})();