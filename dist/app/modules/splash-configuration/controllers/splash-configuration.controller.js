!function(){define(["assetIt","notify-service","kendo-plugin","splash-configuration-services","splash-configuration-model"],function(e){e.register.controller("splashConfigurationController",["$scope","$rootScope","notifyService","splashConfigurationService","authenticationFactory",function(e,s,a,o,i){var t,n;e.initializeController=function(){e.showAnnouncement=!1,e.announcements={title:"",isActive:!0,key:"announcement",messageType:"alert-info",createdBy:i.user,isRemoved:!1},e.alert={title:"",isActive:!0,key:"alert",messageType:"alert-info",createdBy:i.user,isRemoved:!1},o.getAnnouncements().then(function(t){t&&(e.announcements=angular.extend(e.announcements,t.announcement&&t.announcement.length>0?t.announcement[0]:{}),e.alert=angular.extend(e.alert,t.alert&&t.alert.length>0?t.alert[0]:{})),n||(e.showAnnouncement=!0,$("#announcementEditor").kendoEditor({resizable:{content:!1,toolbar:!0}}),n=$("#announcementEditor").data("kendoEditor"),n.value(e.announcements.title))})},e.initializeAlert=function(){t||($("#editor").kendoEditor({resizable:{content:!1,toolbar:!0}}),t=$("#editor").data("kendoEditor"),t.value(e.alert.title))},e.saveAnnouncement=function(){var i=$("<p>"+n.value()+"</p>").text();if(""!==$.trim(i)){e.announcements.title=n.value();var t={data:[]};t.data.push(e.announcements),o.saveAnnoucements(t).then(function(t){t.isSuccess&&(a.notifySuccess({title:"Asset Management Platform",text:"Announcements saved",type:"success"}),s.splashAnnouncements=e.announcements)})}else a.notifySuccess({title:"Asset Management Platform",text:"Please enter Message",type:"failure"})},e.saveSiteAlert=function(){var i=$("<p>"+t.value()+"</p>").text();if(""!==$.trim(i)){e.alert.title=t.value();var n={data:[]};n.data.push(e.alert),o.saveAnnoucements(n).then(function(t){t.isSuccess&&(a.notifySuccess({title:"Asset Management Platform",text:"Site Alert saved",type:"success"}),s.isAlert=e.alert.isActive,s.alertData=e.alert)})}else a.notifySuccess({title:"Asset Management Platform",text:"Please enter Message",type:"failure"})}}])})}();