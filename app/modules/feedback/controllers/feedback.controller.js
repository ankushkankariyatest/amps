/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 19/02/15
 * Time: 11:08 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt', 'feedback-model', 'feedback-service', 'feedback-validation', 'upload-directive'], function (app) {
        app.register.controller('feedbackController', ['$scope', 'feedbackModel', 'feedbackService', 'feedbackValidation',
            function ($scope, feedbackModel, feedbackService, feedbackValidation) {

                $scope.initializeController = function () {
                    $scope.feedback = feedbackModel.initializeFeedback();
                    /*$scope.uploadFile = {
                        success: false
                    };*/
                    $scope.totalCount=250;
                    $scope.remainingCount=250;
                    $scope.dropdown = feedbackModel.getDropdown();
                };
                $scope.updateCount = function() {
                    $scope.remainingCount = $scope.feedback.message.length >= $scope.totalCount ? 0 : $scope.totalCount -$scope.feedback.message.length;
                    $scope.feedback.message = $scope.feedback.message.substring(0, $scope.totalCount);
                };

                $scope.sendFeedBack = function () {
                    /*$scope.feedback.fileUpload.data = $scope.uploadFile.success === true ? String($scope.uploadFile.src).split('base64,')[1] : '';
                    $scope.feedback.fileUpload.name = $scope.uploadFile.success === true ? $scope.uploadFile.name : '';*/
                    if($scope.subject == 'ui') {
                        $scope.feedback.context = 'UI';
                    }
                    feedbackModel.setFeedbackModel($scope.feedback);
                    var validationInfo = feedbackValidation.isValidFeedbackForm($scope.subject);
                    if (validationInfo.isValid) {
                        feedbackService.sendFeedback($scope.subject);
                    } else {
                        $scope.error = validationInfo;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                }
            }
        ]);
    });
})();