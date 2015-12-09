/**
 * Created by Amit Thakkar on 09/07/15.
 */
(function () {
    define(['assetIt', 'notify-service', 'kendo-plugin', 'jquery-ui.min', 'angular-dragdrop', 'site-excel-import-services', 'site-excel-import-model'], function (app) {
        app.register.controller('siteExcelImportController', ['$scope', '$rootScope', '$compile', '$q', 'authenticationFactory', 'siteExcelImportService', 'siteExcelImportModelGridConfigs', 'popupService', 'loadingData', 'notifyService', function ($scope, $rootScope, $compile, $q, authenticationFactory, siteExcelImportService, siteExcelImportModelGridConfigs, popupService, loadingData, notifyService) {
            /** drop target **/
            var importMessage = {message:' Successfully changed.'};
            $scope.masterColList = [];

            $scope.sheetInfo = [];
            $scope.sheetGroups ={
                sheetData: [],
                selectedSheet: "",
                showGroup: false
            };
            $scope.multiOptions = {
                dataSource:[],
                dataTextField: "value",
                dataValueField:"id"
            };
            var sheetNamesWithNoKeysDefined = ['ChangeLog','EACMS','PACS'];
            var additionalKeys = [
                {sheetName: 'Site', keys: [/*{field: 'order', title: 'Row #'}*/]},
                {sheetName: 'CyberSystem', keys: [/*{field: 'order', title: 'Row #'}*/]},
                {sheetName: 'CyberAsset', keys: [{field: 'CyberSystem', title: 'Cyber System'}/*,{field: 'order', title: 'Row #'}*/]},
                {sheetName: 'Decommissioned', keys: [{field: 'CyberSystem', title: 'Cyber System'}/*,{field: 'order', title: 'Row #'}*/]}
            ];
            $scope.initializeController = function () {
                $scope.isAdmin = authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.admin) > -1;
                $scope.isNercCip = authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.nercCip) > -1;

                $scope.indexActive = 1;
                $scope.importExelConfig = siteExcelImportModelGridConfigs.getImportExelConfig();
                $scope.importExelConfig.detailTemplate = kendo.template($("#importTemplate").html());
                $scope.importExelConfig.detailInit = function(e) {
                    var detailRow = e.detailRow;
                    var tabOptions = {};
                    var _model = {};
                    siteExcelImportService.getExceptionRecords(e.data.startTime).then(function(data) {
                        var result = data;
                        _.each(result, function(item, idx){
                            var findObj = _.find($scope.sheetData, {sheetName: item['_id']});
                            if(findObj){
                                var columns = [];
                                _.each(findObj.primaryKey, function(key, index){
                                   columns.push({
                                       field: key,
                                       title: findObj.headers[key] ? findObj.headers[key]: key
                                   });
                                });
                                // Add Additional fields if it does not exist
                                var addedKeys = _.find(additionalKeys, {sheetName: item['_id']});
                                if(addedKeys && addedKeys.keys){
                                    _.each(addedKeys.keys, function(key, i){
                                       if(!_.find(columns, {field: key.field})){
                                           columns.unshift(key);
                                       }
                                    });
                                }
                                item['primaryKeys'] = columns;
                                item['displayName'] = findObj.displayName;
                                item['cols'] = findObj.masterheaders;
                                item['detailRow'] = detailRow;

                            }
                        });
                        _model['startTime'] = e.data.startTime;
                        _model['data'] = result;
                        tabOptions['dynamicGroups'] = result;
                        var tabStrip = detailRow.find(".tabstrip").kendoTabStrip({
                            animation: {
                                open: { effects: "fadeIn" }
                            },
                            select: function (event) {
                                var _activeTabInfo = _tabContent[event.item.textContent];
                                if(''!=_activeTabInfo) {
                                    var deferred = $q.defer();
                                    require([_activeTabInfo.directiveRef], function () {
                                        $scope.$apply(function () {
                                            $scope.data = _model;
                                            deferred.resolve($compile(event.contentElement)($scope));
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }).data("kendoTabStrip");

                        siteExcelImportModelGridConfigs.setTabConfigs(tabOptions, _model);
                        var _tabContent = siteExcelImportModelGridConfigs.getTabConfigs();
                        angular.forEach(_tabContent, function(item){ tabStrip.append(item); });

                        tabStrip.select(0);
                    });
                };

                $scope.refreshGrid();
                $scope.refreshPrimaryTab();
            };
            $scope.manualImport  = function() {
                siteExcelImportService.manualImport({userEmail: authenticationFactory.user});
            };
            $scope.exceptionReportEmail  = function() {
                siteExcelImportService.exceptionReportEmail();
            };
            $scope.manualImportUsers  = function() {
                siteExcelImportService.manualImportUsers({userEmail: authenticationFactory.user});
            };

            $scope.refreshGrid = function(activeTab){
                $scope.indexActive = activeTab?activeTab:$scope.indexActive;
                siteExcelImportService.getLogs().then(function(response) {
                    $scope.importExelConfig.updateGrid(response);
                });
            }
            $scope.refreshPrimaryTab = function(activeTab){
                $scope.indexActive = activeTab?activeTab:$scope.indexActive;
                siteExcelImportService.getSheetNameAndLatestVersion().then(function(response) {
                    $scope.sheetData = _.filter(response, function(item,index){
                        return $.inArray(item.sheetName, sheetNamesWithNoKeysDefined) === -1;
                    });
                });
            }
            $scope.getSheetGroupData = function() {
                $scope.sheetGroups.sheetData=[];
                if($scope.sheetGroups.selectedSheet) {
                    siteExcelImportService.getGroupData($scope.sheetGroups.selectedSheet.sheetName).then(function(response) {
                        $scope.sheetGroups.showGroup = true;
                        var masterColumnList = [];
                        $scope.masterColList = [];
                        var _configuredFields = [];

                        //$scope.sheetGroups.selectedSheet.masterColumnList = masterColumnList;
                        var data = response.isSuccess ? response.groupsData : [];
                        _.each(data, function(val, idx){
                            var dataObject2 = [];
                            _.each(val.dataObject, function(v,i){
                                if(v && $scope.sheetGroups.selectedSheet.headers[v]) {
                                    dataObject2.push({
                                        'id': v, 'title': $scope.sheetGroups.selectedSheet.headers[v],'drag':true
                                    });

                                    _configuredFields.push({id: v});
                                }
                            });
                            val.dataObject2 = dataObject2;
                            //val.dataObject3 = [];
                        });

                        _.each(Object.keys($scope.sheetGroups.selectedSheet.headers), function(val,idx){
                            var findObj = _.where(_configuredFields, {id: val});
                            if(findObj.length <= 0) {
                                if($.inArray(val, $scope.sheetGroups.selectedSheet.primaryKey) === -1) {
                                    $scope.masterColList.push({
                                        'title': $scope.sheetGroups.selectedSheet.headers[val],
                                        'id': val,
                                        'drag': true
                                    });
                                }
                            }
                        });

                        var findObj = _.find(data, {groupName: 'Primary'});
                        if(!findObj){
                            var primaryField = _.find($scope.sheetData, {sheetName: $scope.sheetGroups.selectedSheet.sheetName}).primaryKey;
                            var json = {
                                groupName: 'Primary',
                                dataObject: [],
                                dataObject2: []
                            };
                            _.each(primaryField, function(val,idx){
                                json.dataObject.push(val);
                                json.dataObject2.push({
                                    id: val, title: $scope.sheetGroups.selectedSheet.headers[val]
                                });
                            });
                            data.unshift(json);
                        }else if(findObj.dataObject2.length === 0){
                            var primaryField = _.find($scope.sheetData, {sheetName: $scope.sheetGroups.selectedSheet.sheetName}).primaryKey;
                            var dataObject2 = [];
                            _.each(primaryField, function(val,idx){
                                dataObject2.push({
                                    id: val, title: $scope.sheetGroups.selectedSheet.headers[val]
                                });
                            });
                            findObj.dataObject2 = dataObject2;
                        }

                        $scope.sheetGroups.groupData = data;
                        var masterCols = [];
                        for (var i in $scope.sheetGroups.selectedSheet.headers) {
                            masterCols.push({
                                id:  i,
                                value: $scope.sheetGroups.selectedSheet.headers[i]
                            });
                        }
                        $scope.multiOptions.dataSource=masterCols;
                    });
                }
            }
            $scope.addGroup = function() {
                $scope.sheetGroups.groupData.push({
                    groupName: "",
                    dataObject: [],
                    dataObject2: []
                });
            }
            $scope.removeGroup = function(group) {
                //re-add the columns to master list - masterColList
                for (var index = 0; index < $scope.sheetGroups.groupData.length; index++) {
                    // If current array item equals itemToRemove then
                    if ($scope.sheetGroups.groupData[index].groupName === group.groupName) {
                        //Add item back to parent selection list
                        _.each($scope.sheetGroups.groupData[index].dataObject2, function(val,idx){
                            var findObj = _.find($scope.masterColList, {id: val.id});
                            if(!findObj){
                                $scope.masterColList.push({
                                    'title': $scope.sheetGroups.selectedSheet.headers[val.id],
                                    'id': val.id,
                                    'drag': true
                                });
                            }
                        });
                        // Remove array item at current index
                        $scope.sheetGroups.groupData.splice(index, 1);
                        break;
                    }
                }
            };

            $scope.$watch("masterColList", function (value) {
                $scope.masterColList = _.sortBy($scope.masterColList, 'title');
            }, true);

            $scope.saveGroups = function() {
                var groupArr = [];
                for(var i in $scope.sheetGroups.groupData) {
                    if($scope.sheetGroups.groupData[i].groupName!='') {
                        var _dataObject = [];
                        _.each($scope.sheetGroups.groupData[i].dataObject2, function(val,idx){
                            _dataObject.push(val.id);
                        });
                        groupArr.push({
                            groupName: $scope.sheetGroups.groupData[i].groupName,
                            dataObject: _dataObject
                        });
                    }
                }
                var data = {
                    createdBy: authenticationFactory.user,
                    groupData: groupArr,
                    sheetName: $scope.sheetGroups.selectedSheet.sheetName
                };
                //console.log(data);
                siteExcelImportService.postGroupData(data).then(function(response) {
                    //$scope.sheetGroups.showGroup = false;
                    notifyService.notifySuccess(
                        {title: 'Asset Management Platform',
                            text: 'Group configuration saved',
                            type: 'success'}
                    );
                    //popupService.importSuccessPopup({message:'Group data saved'});
                });
            }

            $scope.validForm = function(){
                if(!$scope.sheetData || $scope.sheetData.length <= 0){
                    return true;
                }
                if(!$scope.sheetGroups.groupData || $scope.sheetGroups.groupData.length <= 0) {
                    return true;
                }
                var cntPrimary = 0;
                for(var i in $scope.sheetGroups.groupData) {
                    if($scope.sheetGroups.groupData[i].groupName === '')
                        return true;
                    if($scope.sheetGroups.groupData[i].dataObject2.length <= 0)
                        return true;
                    if($scope.sheetGroups.groupData[i].groupName === 'Primary')
                        cntPrimary++;
                }
                if(cntPrimary > 1)
                    return true;
                return false;
            }

            $scope.removeAttribute = function(item, group){
                for (var index = 0; index < group.dataObject2.length; index++) {
                    // If current array item equals itemToRemove then
                    if (group.dataObject2[index].id === item.id) {
                        // Remove array item at current index
                        group.dataObject2.splice(index, 1);
                        //Add item back to parent selection list
                        $scope.masterColList.push({
                            'title': item.title,
                            'id': item.id,
                            'drag': true
                        });
                        break;
                    }
                }
            }
            $scope.dataChanged = function(value){
                var sheetGroupData = $scope.sheetGroups.groupData;
                var currentIndex = sheetGroupData.indexOf(value);
                for (var i=0; i < sheetGroupData.length; i++) {
                    if (i != currentIndex && sheetGroupData[i].groupName === value.groupName) {
                        value.groupName = '';
                        value.isError = true;
                        break;
                    }else{
                        value.isError = false;
                    }
                }
            }
        }]);
    });
})();