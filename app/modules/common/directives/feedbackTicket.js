/**
 * Created by Amit Thakkar on 09/04/15.
 */
(function (d) {
    "use strict";
    d(["assetIt", "GlobalFilters", 'ticket-service'], function (app) {
        app.register.constant("FEEDBACK_TICKET_CONTSTANT", {
            MOOD: {
                HAPPY: "happy"
            },
            STATUS: {
                SUBMITTED: "submitted"
            }
        });
        app.register.filter("showNFeedback", function () {
            return function (feedbackTickets, count) {
                if (!count || feedbackTickets.length <= count) {
                    return feedbackTickets;
                } else {
                    return feedbackTickets.slice(0, count);
                }
            };
        });
        app.register.filter("remainingCount", function () {
            return function (textLength, count) {
                var remainingCount = textLength ? count - textLength : count;
                return remainingCount < 0 ? 0 : remainingCount;
            };
        });
        app.register.directive("maxTextCount", [function () {
            return {
                require: "ngModel",
                scope: {
                    text: "=ngModel"
                },
                link: function ($scope, $element, attributes) {
                    var maxTextCount = attributes.maxTextCount;
                    $element.bind("keyup", function () {
                        if ($scope.text.length > maxTextCount) {
                            $scope.text = $scope.text.substring(0, maxTextCount);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }
                    });
                }
            }
        }]);
        app.register.filter("getFirstPartOfEmail", function () {
            return function (email) {
                if(!email) {
                    return "-";
                }
                return email.split("@")[0];
            };
        });
        app.register.controller("FeedbackTicketController", ["$scope", "FeedbackTicketService", "$location", "FEEDBACK_TICKET_CONTSTANT", "loadingData",
            function ($scope, FeedbackTicketService, $location, FEEDBACK_TICKET_CONTSTANT, loadingData) {
                loadingData.start();
                var feedbackTicketCtrl = this;
                feedbackTicketCtrl.initialShowingFeedbackCount = 2;
                FeedbackTicketService.get($scope.appId, $scope.context)
                    .then(function (feedbackTickets) {
                        feedbackTicketCtrl.feedbackTickets = feedbackTickets;
                        loadingData.stop();
                    }, function (error) {
                        feedbackTicketCtrl.addFeedbackTicketErrorMessage = error.ErrorKey;
                        console.log("Error", error);
                        loadingData.stop();
                    });
                feedbackTicketCtrl.post = function () {
                    if (feedbackTicketCtrl.newFeedbackTicket && !feedbackTicketCtrl.isAddingNewFeedbackTicket && feedbackTicketCtrl.newFeedbackTicket.trim() != "") {
                        loadingData.start();
                        feedbackTicketCtrl.isAddingNewFeedbackTicket = true;
                        feedbackTicketCtrl.addFeedbackTicketErrorMessage = undefined;
                        var newFeedbackTicketObject = {
                            "context": $scope.context,
                            "id": $scope.appId,
                            "page": $location.absUrl(),
                            "mood": FEEDBACK_TICKET_CONTSTANT.MOOD.HAPPY,
                            "message": feedbackTicketCtrl.newFeedbackTicket.trim(),
                            "status": FEEDBACK_TICKET_CONTSTANT.STATUS.SUBMITTED
                        };
                        FeedbackTicketService.post(newFeedbackTicketObject, ($scope.noWorkOrder == "false") ? false: true)
                            .then(function (response) {
                                feedbackTicketCtrl.feedbackTickets.push(response.response);
                                feedbackTicketCtrl.isAddingNewFeedbackTicket = false;
                                feedbackTicketCtrl.newFeedbackTicket = "";
                                $scope.$evalAsync($scope.updateFeedbackCount()($scope.appId, feedbackTicketCtrl.feedbackTickets.length));
                                loadingData.stop();
                            }, function (error) {
                                feedbackTicketCtrl.isAddingNewFeedbackTicket = false;
                                feedbackTicketCtrl.addFeedbackTicketErrorMessage = error.ErrorKey;
                                feedbackTicketCtrl.newFeedbackTicket = "";
                                loadingData.stop();
                            });
                        feedbackTicketCtrl.isEditorVisible = false;
                    } else {
                        feedbackTicketCtrl.addFeedbackTicketErrorMessage = "Please Enter Feedback";
                    }
                };
                feedbackTicketCtrl.cancel = function () {
                    feedbackTicketCtrl.newFeedbackTicket = "";
                    feedbackTicketCtrl.addFeedbackTicketErrorMessage = "";
                    feedbackTicketCtrl.isEditorVisible = false;
                };
            }]);
        app.register.directive("feedbackTicket", function () {
            return {
                restrict: "E",
                scope: {
                    appId: "@",
                    context: "@",
                    updateFeedbackCount: "&",
                    noWorkOrder: "@"
                },
                //replace: true,
                templateUrl: 'app/modules/common/templates/feedbackTicket.html',
                controller: "FeedbackTicketController",
                controllerAs: "feedbackTicketCtrl"
            }
        });
        app.register.controller("FeedbackTicketCommentController", ["$scope", "FeedbackTicketService", "loadingData",
            function ($scope, FeedbackTicketService, loadingData) {
                var feedbackTicketCommentCtrl = this;
                feedbackTicketCommentCtrl.cancel = function () {
                    feedbackTicketCommentCtrl.newFeedbackTicketComment = "";
                    feedbackTicketCommentCtrl.addFeedbackTicketCommentErrorMessage = "";
                    $scope.isAddingFeedback = false;
                };
                feedbackTicketCommentCtrl.post = function () {
                    if (feedbackTicketCommentCtrl.newFeedbackTicketComment && !feedbackTicketCommentCtrl.isAddingNewFeedbackTicketComment && feedbackTicketCommentCtrl.newFeedbackTicketComment.trim() != "") {
                        loadingData.start();
                        feedbackTicketCommentCtrl.isAddingNewFeedbackTicketComment = true;
                        feedbackTicketCommentCtrl.addFeedbackTicketCommentErrorMessage = undefined;
                        var newFeedbackTicketCommentObject = {
                            "feedback_id": $scope.feedbackId,
                            "workOrder": $scope.workOrderId,
                            "context": $scope.context,
                            "id": $scope.appId,
                            "description": feedbackTicketCommentCtrl.newFeedbackTicketComment.trim()
                        };
                        FeedbackTicketService.postComment(newFeedbackTicketCommentObject)
                            .then(function (response) {
                                if (!$scope.comments || !$scope.comments.length) {
                                    $scope.comments = [];
                                }
                                $scope.comments.push(response.response);
                                feedbackTicketCommentCtrl.isAddingNewFeedbackTicketComment = false;
                                feedbackTicketCommentCtrl.newFeedbackTicketComment = "";
                                $scope.isAddingFeedback = false;
                                loadingData.stop();
                            }, function (error) {
                                feedbackTicketCommentCtrl.isAddingNewFeedbackTicketComment = false;
                                feedbackTicketCommentCtrl.addFeedbackTicketCommentErrorMessage = error.ErrorKey;
                                feedbackTicketCommentCtrl.newFeedbackTicketComment = "";
                                loadingData.stop();
                            });
                    } else {
                        feedbackTicketCommentCtrl.addFeedbackTicketCommentErrorMessage = "Please Enter Comment";
                    }
                };
            }]);
        app.register.directive("feedbackTicketComment", function () {
            return {
                restrict: "E",
                scope: {
                    feedbackId: "@",
                    appId: "@",
                    context: "@",
                    workOrderId: "@",
                    isAddingFeedback: "=",
                    comments: "="
                },
                replace: true,
                templateUrl: 'app/modules/common/templates/feedbackTicketComment.html',
                controller: "FeedbackTicketCommentController",
                controllerAs: "feedbackTicketCommentCtrl"
            }
        });
    });
})(define);