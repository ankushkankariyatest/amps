/**
 * Created by wiznidev on 9/18/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.controller("siteVersionComparorController", ["$scope", 'siteUtilityModuleServices',
            function ($scope, siteUtilityModuleServices) {
                var siteVersionComparorCtrl = this;
                siteVersionComparorCtrl.showDifference = {};
                siteVersionComparorCtrl.compareToUpdated = function(val){
                    siteVersionComparorCtrl.selectedComparerToVersion = val.createdAt;
                    siteVersionComparorCtrl.comparerToVersion = val.version;
                }
                siteVersionComparorCtrl.compareFromUpdated = function(val){
                    siteVersionComparorCtrl.selectedComparerFromVersion = val.createdAt;
                    siteVersionComparorCtrl.comparerFromVersion = val.version;
                }
                var _condition = [];
                _.each($scope.keys, function(val,idx){
                    _condition.push({col: val, val: $scope.rowData[val]});
                });
                var serviceData = {
                    sheetName: $scope.sheetName,
                    key: _condition
                };
                siteUtilityModuleServices.getHistoryData(serviceData).then(function(resp){
                    resp = _.sortBy(resp, 'createdAt').reverse();
                    siteVersionComparorCtrl.siteDetail = resp;
                });
                siteVersionComparorCtrl.compareVersionsTab = function(){
                    if(isNaN(siteVersionComparorCtrl.comparerFromVersion) || isNaN(siteVersionComparorCtrl.comparerToVersion))
                        return;
                    var selectVersion = _.find(siteVersionComparorCtrl.siteDetail, {version: Number(siteVersionComparorCtrl.comparerToVersion)});
                    var currentRowVersion = _.find(siteVersionComparorCtrl.siteDetail, {version: Number(siteVersionComparorCtrl.comparerFromVersion)});
                    if(angular.equals(selectVersion.recordData,currentRowVersion.recordData)){
                        var _comparorModel = {
                            isDiff : false
                        };
                        siteVersionComparorCtrl.comparorModel = _comparorModel;
                    }else{
                        var _comparorModel ={
                            isDiff : true,
                            currentVersion : siteVersionComparorCtrl.comparerFromVersion,
                            currentVersionDate: currentRowVersion.createdAt,
                            currentRowVersionData: currentRowVersion.recordData,
                            selectedVersion : siteVersionComparorCtrl.comparerToVersion,
                            selectedVersionDate: selectVersion.createdAt,
                            selectedVersionData: selectVersion.recordData,
                            compareKeysData : _.union(_.keys(selectVersion.recordData), _.keys(currentRowVersion.recordData))
                        };
                        siteVersionComparorCtrl.comparorModel = _comparorModel;
                    }
                    siteVersionComparorCtrl.showDifference.value = true;
                };
            }]);
        app.register.directive('siteVersionComparor', function () {
            return {
                restrict: "AE",
                templateUrl:'app/modules/site-utility-module/templates/site-tabs/site-version-comparor.html',
                scope:{
                    rowData: '=',
                    sheetName:'=',
                    cols:'=',
                    title:'@',
                    keys:'='
                },
                controller: "siteVersionComparorController",
                controllerAs: "siteVersionComparorCtrl",
                link: function ($scope, element, attr) {
                }
            };
        });
    });
})();