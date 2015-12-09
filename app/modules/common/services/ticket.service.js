(function (define) {
    "use strict";
    define(["assetIt", "GlobalFilters"], function (app) {
        app.register.service("FeedbackTicketService", ["ajaxService", "configUrl", "authenticationFactory",
            function (ajaxService, configUrl, authenticationFactory) {

                var _feedBackEnum = {
                    GET_FEEDBACK: "feedback",
                    POST_FEEDBACK: "ticket",
                    POST_COMMENT: "comments",
                    POST_FEEDBACK_NO_WO:"feedback"
                };

                this.get = function (appId, context) {
                    return ajaxService.http({
                        method: "GET",
                        url: _feedBackEnum.GET_FEEDBACK + "?id=" + appId + "&context=" + context
                    });
                };
                this.post = function (newFeedbackTicketObject,noWorkOrder) {
                    newFeedbackTicketObject.email = authenticationFactory.getUserName();
                    return ajaxService.http({
                        method: "POST",
                        url: noWorkOrder ?_feedBackEnum.POST_FEEDBACK_NO_WO: _feedBackEnum.POST_FEEDBACK,
                        data: newFeedbackTicketObject
                    });
                };
                this.postComment = function (newFeedbackTicketCommentObject) {
                    newFeedbackTicketCommentObject.email = authenticationFactory.getUserName();
                    return ajaxService.http({
                        method: "POST",
                        url: _feedBackEnum.POST_COMMENT,
                        data: newFeedbackTicketCommentObject
                    });
                };
            }]);
    });
})(define);
