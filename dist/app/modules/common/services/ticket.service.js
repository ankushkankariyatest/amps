!function(t){"use strict";t(["assetIt","GlobalFilters"],function(t){t.register.service("FeedbackTicketService",["ajaxService","configUrl","authenticationFactory",function(e,n,i){var t={GET_FEEDBACK:"feedback",POST_FEEDBACK:"ticket",POST_COMMENT:"comments",POST_FEEDBACK_NO_WO:"feedback"};this.get=function(i,n){return e.http({method:"GET",url:t.GET_FEEDBACK+"?id="+i+"&context="+n})},this.post=function(n,r){return n.email=i.getUserName(),e.http({method:"POST",url:r?t.POST_FEEDBACK_NO_WO:t.POST_FEEDBACK,data:n})},this.postComment=function(n){return n.email=i.getUserName(),e.http({method:"POST",url:t.POST_COMMENT,data:n})}}])})}(define);