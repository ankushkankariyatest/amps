/**
 * Created by Amit Thakkar on 09/07/15.
 */
(function () {
    define(['assetIt', 'notify-service', 'kendo-plugin', 'splash-configuration-services', 'splash-configuration-model'], function (app) {
        app.register.controller('splashConfigurationController', ['$scope', '$rootScope', 'notifyService', 'splashConfigurationService', 'authenticationFactory', function ($scope, $rootScope, notifyService, splashConfigurationService, authenticationFactory) {
            var editor;
            var announcementEditor;
            $scope.initializeController = function () {
                $scope.showAnnouncement = false;
                $scope.announcements = {
                    title: '',
                    isActive: true,
                    key: "announcement",
                    messageType: "alert-info",
                    createdBy: authenticationFactory.user,
                    isRemoved: false
                };
                $scope.alert = {
                    title: "",
                    isActive: true,
                    key: "alert",
                    messageType: "alert-info",
                    createdBy: authenticationFactory.user,
                    isRemoved: false
                };

                splashConfigurationService.getAnnouncements().then(function (resp) {
                    if (resp) {
                        $scope.announcements = angular.extend($scope.announcements, resp['announcement'] && resp['announcement'].length > 0 ? resp['announcement'][0] : {});
                        $scope.alert = angular.extend($scope.alert, resp['alert'] && resp['alert'].length > 0 ? resp['alert'][0] : {});
                    }
                    if (!announcementEditor) {
                        $scope.showAnnouncement = true;
                        $("#announcementEditor").kendoEditor({
                            resizable: {
                                content: false,
                                toolbar: true
                            }
                        });
                        announcementEditor = $("#announcementEditor").data("kendoEditor");
                        announcementEditor.value($scope.announcements.title);
                    }
                });
            };
            $scope.initializeAlert = function () {
                if (!editor) {
                    $("#editor").kendoEditor({
                        resizable: {
                            content: false,
                            toolbar: true
                        }
                    });
                    editor = $("#editor").data("kendoEditor");
                    editor.value($scope.alert.title);
                }

            };
            $scope.saveAnnouncement = function () {
                var announcementEditorValue = $('<p>' + announcementEditor.value() + '</p>').text();
                if ($.trim(announcementEditorValue) !== "") {
                    $scope.announcements.title = announcementEditor.value();
                    var request = {
                        data: []
                    };
                    request.data.push($scope.announcements);
                    splashConfigurationService.saveAnnoucements(request).then(function (resp) {
                        if (resp.isSuccess) {
                            notifyService.notifySuccess(
                                {
                                    title: 'Asset Management Platform',
                                    text: 'Announcements saved',
                                    type: 'success'
                                }
                            );
                            // Apply the updates to $rootScope to reflect for current user; other users will need to refresh their browsers to view the messages
                            $rootScope.splashAnnouncements = $scope.announcements;
                        }
                    });
                }
                else {
                    notifyService.notifySuccess(
                        {
                            title: 'Asset Management Platform',
                            text: 'Please enter Message',
                            type: 'failure'
                        }
                    );
                }

            };
            $scope.saveSiteAlert = function () {
                var editorValue = $('<p>' + editor.value() + '</p>').text();
                if ($.trim(editorValue) !== "") {
                    $scope.alert.title = editor.value();
                    var request = {
                        data: []
                    };
                    request.data.push($scope.alert);
                    splashConfigurationService.saveAnnoucements(request).then(function (resp) {
                        if (resp.isSuccess) {
                            notifyService.notifySuccess(
                                {
                                    title: 'Asset Management Platform',
                                    text: 'Site Alert saved',
                                    type: 'success'
                                }
                            );
                            // Apply the updates to $rootScope to reflect for current user; other users will need to refresh their browsers to view the messages
                            $rootScope.isAlert = $scope.alert.isActive;
                            $rootScope.alertData = $scope.alert;
                        }
                    });
                }

                else {
                    notifyService.notifySuccess(
                        {
                            title: 'Asset Management Platform',
                            text: 'Please enter Message',
                            type: 'failure'
                        }
                    );
                }
            }
        }]);
    });
})();