(function () {
    "use strict";
    define(['assetIt', 'feedbackList-service', 'feedbackList-config', 'filter-options', 'kendo-plugin'], function (app) {
        app.register.controller('feedbackListController', ['$scope', '$compile', 'feedbackListService', 'feedbackListConfig',
            function ($scope, $compile, feedbackService, feedbackConfig) {
                $scope.initializeController = function () {
                    var prevStage;
                    var _appConfigs = feedbackConfig.getConfigs();
//                    var timestampToDateTime = function (value) {
//                        var d = new Date(value);
//                        var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
//                        var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
//                        var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
//                        var formattedTime = hours + ":" + minutes;
//                        formattedDate = formattedDate + " " + formattedTime;
//                        debugger;
//                        return formattedDate;
//                    }

                    $scope.config = _appConfigs;
                    //Detail Expanded view configuration
                    $scope.config.detailTemplate = kendo.template($("#appTemplate").html());
                    $scope.config.detailInit = function (e) {
                        var detailRow = e.detailRow;
                    };
                    $scope.config.filterable = {
                        extra: false,
                        operators: {
                            string: {
                                //startswith: "Starts with",
                                eq: "Is equal to",
                                neq: "Is not equal to"
                            }
                        }
                    };
                    feedbackService.getFeedbacks().then(function (data) {
                        $scope.config.updateGrid(data);
                    },
                            function (error) {
                                console.log('feedback service failed..' + error);
                            }
                    );
                };
                $scope.filterGridRecord = function (text) {
                    var _appConfigs = feedbackConfig.getConfigs();
                    $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
                }
            }]);
    });
})();