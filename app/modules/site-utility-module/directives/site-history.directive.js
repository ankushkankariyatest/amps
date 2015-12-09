/**
 * Created by wiznidev on 9/18/2015.
 */
(function () {
    "use strict";
    define(['assetIt',"GlobalFilters"], function (app) {
        app.register.controller("siteHistoryController", ["$scope", 'siteUtilityModuleServices', 'popupService',
            function ($scope, siteUtilityModuleServices, popupService) {
                var siteHistoryCtrl = this;
                siteHistoryCtrl.showVersionDetail = function(selectedVersion){
                    var currentRowVersion = _.find(siteHistoryCtrl.siteDetail, {version: selectedVersion}).recordData;
                    popupService.showSiteHistoryDetails({rowData:currentRowVersion});
                };
                var _title = '';
                var _condition = [];
                _.each($scope.keys, function(val,idx){
                    _condition.push({col: val, val: $scope.rowData[val]});
                    if(_title === ''){
                        _title = $scope.rowData[val];
                    }else{
                        _title = _title + ' ' + $scope.rowData[val];
                    }
                });
                var serviceData = {
                    sheetName: $scope.sheetName,
                    key: _condition
                };

                siteUtilityModuleServices.getHistoryData(serviceData).then(function(resp){
                    resp = _.sortBy(resp, 'createdAt').reverse();
                    siteHistoryCtrl.title = _title;
                    for(var i = 0; i < resp.length; i++){
                        if(i === resp.length - 1){
                            resp[i].comment = 'added';
                        }else{
                            if(angular.equals(resp[i].recordData, resp[i+1].recordData)){
                                resp[i].comment = 'no change';
                            }
                            else if( _.keys(resp[i].recordData).length !== _.keys(resp[i+1].recordData).length){
                                resp[i].comment = 'changed attributes for ';
                            }else {
                                resp[i].comment = 'changed values for ';
                            }

                            resp[i].compareKeysData = _.union(_.keys(resp[i].recordData), _.keys(resp[i+1].recordData))
                        }
                    }
                    _.each(resp, function(value, index){
                        if(index !== resp.length - 1){

                        }else{
                            value.comment = 'added';
                        }
                    });
                    siteHistoryCtrl.siteDetail = resp;
                });
            }]);
        app.register.directive('siteHistory', function () {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/site-utility-module/templates/site-tabs/site-history.html',
                scope:{
                    rowData: '=',
                    sheetName:'=',
                    cols:'=',
                    title:'@',
                    keys:'='
                },
                controller: "siteHistoryController",
                controllerAs: "siteHistoryCtrl",
                link: function ($scope, element, attr) {
                }
            };
        });
    });
})();