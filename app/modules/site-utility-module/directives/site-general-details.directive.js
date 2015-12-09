/**
 * Created by wizdev on 8/6/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.controller("siteGeneralDetailsController", ["$scope",
            function ($scope) {
                var siteGeneralDetailsCtrl = this;
                siteGeneralDetailsCtrl.siteDetail = $scope.rowData;
                siteGeneralDetailsCtrl.dataObject = _.find($scope.groupData, {groupName: $scope.tabTitle}).dataObject;
            }]);
        app.register.directive('siteGeneralDetails', function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/site-utility-module/templates/site-tabs/site-general-details.html',
                scope:{
                    rowData:'=',
                    cols:'=',
                    groupData:'=',
                    tabTitle:'@'
                },
                controller: "siteGeneralDetailsController",
                controllerAs: "siteGeneralDetailsCtrl",
                link: function ($scope, element, attr) {

                }
            };
        });
    });
})();