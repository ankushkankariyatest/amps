
(function () {
    define(['assetIt', 'audit-logs-service', 'audit-logs-model','ui-bootstrap', 'filter-options', 'kendo-plugin'], function (app) {
        app.register.controller('auditLogsController', ['$scope', '$rootScope', 'auditLogsService', 'auditLogsModel', function ($scope, $rootScope, auditLogsService, auditLogsModel) {
            $scope.initializeController = function () {
                $scope.filterApplied = false;
                $scope.auditLogsConfig = auditLogsModel.getAuditLogsConfig();
                refreshGrid();
                $scope.fromDateObject = null;
                $scope.toDateObject = null;
                $scope.selectedActivityLog = '';
                $scope.maxDate = new Date();
            };
            $scope.activityLogs = [];
            var originalResponse = [];
            var refreshGrid = function(){
                auditLogsService.getLogs().then(function(response) {
                    // FORMAT DATA
                    _.each(response, function(resp, idx){
                        if($.inArray(resp.activity, $scope.activityLogs) < 0){
                            $scope.activityLogs.push(resp.activity);
                        }
                        resp['createdAtDt'] = resp['createdAt'];
                        resp['createdAt'] = new Date(resp['createdAt']).toLocaleString(); // Format Date Object
                        // Compare the OLD and NEW objects
                        var diffMsg = '';
                        if(resp['dataObject']) {
                            if (angular.equals(resp['dataObject'].old, resp['dataObject'].new)) {
                                diffMsg = 'No change';
                            } else {
                                // CHECK FOR STATUS CHANGE
                                if (resp['dataObject'].old.status !== resp['dataObject'].new.status) {
                                    diffMsg += 'Status changed from ' + getUserFriendlyStatus(resp['dataObject'].old.status) + ' to ' + getUserFriendlyStatus(resp['dataObject'].new.status) + '<br>';
                                }
                                // CHECK FOR ROLE CHANGE
                                if (!angular.equals(_.sortBy(resp['dataObject'].old.roles), _.sortBy(resp['dataObject'].new.roles))) {
                                    diffMsg += 'Previous Role(s): ';
                                    var roles = [];
                                    _.each(resp['dataObject'].old.roles, function (val, idx) {
                                        roles.push(getUserFriendlyRole(val));
                                    });
                                    diffMsg += roles.join();
                                    diffMsg += '<br>New Role(s): ';
                                    roles = [];
                                    _.each(resp['dataObject'].new.roles, function (val, idx) {
                                        roles.push(getUserFriendlyRole(val));
                                    });
                                    diffMsg += roles.join();
                                }
                            }
                        }
                        resp['changes'] = diffMsg;
                    });
                    $scope.auditLogsConfig.updateGrid(response);
                    originalResponse = response;
                });
            };
            $scope.filterGridRecord = function (text) {
                var _appConfigs = auditLogsModel.getAuditLogsConfig();
                $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
            };
            function getUserFriendlyStatus(status){
                var retVal = '';
                switch(status){
                    case 1: retVal = 'Active';break;
                    case 0: retVal = 'Inactive'; break;
                    default: retVal = ''; break;
                }
                return retVal;
            }
            function getUserFriendlyRole(role){
                var retVal = '';
                switch(role){
                    case 1: retVal = 'AMPS Admin';break;
                    case 2: retVal = 'NERC CIP'; break;
                    case 3: retVal = 'Enterprise'; break;
                    default: retVal = ''; break;
                }
                return retVal;
            }
            $scope.fromDateChanged = function () {
                $scope.toDateObject = null;
                $scope.toDateString = null;
            };

            $scope.advancedFilter = function(){
                var copyOfResponse = [].concat(originalResponse);
                // Activity Log
                if($scope.selectedActivityLog !== '') {
                    copyOfResponse = _.where(copyOfResponse, {activity: $scope.selectedActivityLog});
                }
                // Start Date
                if($scope.fromDateObject) {
                    copyOfResponse = _.filter(copyOfResponse, function(obj){
                        return obj.createdAtDt >= $scope.fromDateObject.getTime();
                    });
                }
                // End Date
                if($scope.toDateObject) {
                    var tomorrowDate = angular.copy($scope.toDateObject);
                    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                    copyOfResponse = _.filter(copyOfResponse, function(obj){
                        return obj.createdAtDt <= tomorrowDate;
                    });
                }
                $scope.auditLogsConfig.updateGrid(copyOfResponse);
            };

            $scope.clearFilter = function(){
                $scope.filterApplied = false;
                $scope.toDateObject = null;
                $scope.toDateString = null;
                $scope.fromDateObject = null;
                $scope.fromDateString = null;
                $scope.selectedActivityLog = '';
                $scope.auditLogsConfig.updateGrid(originalResponse);
            };
        }]);
    });
})();