/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 03/03/15
 * Time: 6:14 PM
 * To change this template use File | Settings | File Templates.
 */

(function ($, angular) {
    "use strict";
    define(['assetIt', 'applicationService', 'app-config', 'filter-options', 'kendo-plugin', 'FeedbackTicket', 'bootstrap-popup', 'grid-grouping', 'grid-filtering'], function (app) {
        app.register.controller('appController', ['$scope', '$rootScope', '$q', '$compile', 'applicationService', '$routeParams', '$location', 'configUrl', 'appConfig', 'appConstantPath', 'authenticationFactory', 'popupService',
            function ($scope, $rootScope, $q, $compile, applicationService, $routeParams, $location, configUrl, appConfig, appConstantPath, authenticationFactory, popupService) {
                var filterInfo = {
                    searchFilters:{},
                    pluginFilters:{}
                };
                var _searchTextData='';
                var jsonData = [];
                var isEnterpriseUser = authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.enterprise) > -1;
                var _height = 720;
                $scope.contextVal = 'APPLICATION';
                function normalPluginFilterLogic(){
                    var resultFilter = {};
                    var _isSearchTextActive = _searchTextData;
                    if(_isSearchTextActive && '' != _isSearchTextActive.trim()){
                        resultFilter = filterInfo.searchFilters;
                    }
                    var dupes = _.uniq(_.pluck(_.where(filterInfo.pluginFilters.filters, {'operator': 'DUPLICATE'}), 'field'));
                    if(dupes.length > 0){
                        // Duplicate check logic
                        var result = [];
                        _.each(dupes, function(value, index){
                            var d = _.groupBy(jsonData, value);
                            _.each(d, function(val, idx){
                                if(idx !== '' && val.length > 1){
                                    result = _.union(result, val);
                                }
                            });
                        });
                        $scope.config.updateGrid(result);
                        $scope.filterGridByFilterPlugin(resultFilter);
                    }else {
                        if (filterInfo.pluginFilters && filterInfo.pluginFilters.logic) {
                            resultFilter = filterInfo.pluginFilters;
                        }
                        if (_isSearchTextActive && '' != _isSearchTextActive && filterInfo.pluginFilters && filterInfo.pluginFilters.logic) {
                            resultFilter = {
                                logic: "and",
                                filters: []
                            };
                            if(filterInfo.searchFilters.filters.length > 0)
                                resultFilter.filters.push(filterInfo.searchFilters);
                            if(filterInfo.pluginFilters.filters.length > 0)
                                resultFilter.filters.push(filterInfo.pluginFilters);
                        };
                        if ($routeParams.id) {
                            resultFilter = $scope.config.dataSource.filter;
                        }
                        $scope.config.updateGrid(jsonData);
                        $scope.filterGridByFilterPlugin(resultFilter);
                    }
                }
                function leftJoin(left, right) {
                    var result = [];
                    _.each(left, function (litem) {
                        litem.processInfo = getProcessName(litem, right);
                        litem.lobInfo = getLobName(litem);
                        litem['isEnterprise'] = isEnterpriseUser;
                        result.push(litem);
                    });
                    return result;
                }
                function getProcessName(litem, right) {
                    var _column = 'PROCESS';
                    var modifiedProcessValue = '';
                    var _process = litem[_column];
                    var processInfo = [];
                    if (null == _process || 'undefined' == _process) {
                        modifiedProcessValue = _process;
                    }
                    else {
                        var _processData = splitString(_process, ';#');

                        if (_processData.length == 1) {
                            modifiedProcessValue = _processData[0];
                            processInfo.push(right[_processData[0]]);
                        }
                        else if (_processData.length > 1) {
                            modifiedProcessValue = 'Multiple';

                            _.each(_processData, function (item, index) {
                                var _process = right[item];
                                _process = (undefined === _process) ? { 'CODE': item } : _process;
                                processInfo.push(_process);
                            });
                        }
                    }
                    litem.modifiedProcessValue = modifiedProcessValue;
                    return processInfo;
                }
                function splitString(item, _splitValue) {
                    var _stringData = (item.indexOf(_splitValue) == 0) ? item.substr(_splitValue.length, item.length - _splitValue.length) : item;
                    _stringData = (_stringData.lastIndexOf(_splitValue) == _stringData.length - _splitValue.length) ? _stringData.substr(0, _stringData.length - _splitValue.length) : _stringData;
                    return _stringData.split(_splitValue);
                }
                function getLobName(litem) {
                    var _column = 'LINE_OF_BUSINESS';
                    var modifiedLobValue = '';
                    var _lob = litem[_column];
                    var lobInfo = [];
                    if (null == _lob || 'undefined' == _lob) {
                        modifiedLobValue = '';
                    }
                    else {
                        var _lobData = splitString(_lob, ';#');

                        if (_lobData.length == 1) {
                            modifiedLobValue = _lobData[0];
                            lobInfo.push(_lobData[0]);
                        }
                        else if (_lobData.length > 1) {
                            modifiedLobValue = 'Multiple';
                            _.each(_lobData, function (item, index) {
                                lobInfo.push(item);
                            });
                        }
                    }
                    litem.modifiedLobValue = modifiedLobValue;
                    return lobInfo;
                }

                var collapseAllGroups = function (grid) {
                    grid.table.find(".k-grouping-row").each(function () {
                        grid.collapseGroup(this);
                    });
                    var firstGroup = grid.table.find(".k-grouping-row").first();
                    grid.expandGroup(firstGroup);
                };

                $scope.initializeController = function () {
                    var prevStage;
                    var _appConfigs = appConfig.getConfigs();
                    $scope.config = _appConfigs;
                    $scope.config.height = _height; // Initial
                    $scope.config.dataBound = function (e) {
                        $("[data-toggle='tooltip']").tooltip();
                        collapseAllGroups(this);
                    };
                    $scope.config.groupable = {
                        messages: {
                            empty: ""
                        }
                    };
                    $scope.bacrConfig =  appConfig.getBacrConfigs();

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

                    //Detail Expanded view configuration
                    $scope.config.detailTemplate = kendo.template($("#template").html());
                    $scope.config.detailInit = function (e) {
                        var detailRow = e.detailRow;
                        var tabStrip = detailRow.find(".tabstrip").kendoTabStrip({
                            animation: {
                                open: { effects: "fadeIn" }
                            },
                            select: function (event) {
                                if (event.item.textContent.indexOf('Feedback') > -1) {
                                    $compile(event.contentElement)($scope);
                                }
                                if (event.item.textContent.indexOf('Certification') > -1) {
                                    //console.log(serviceData);
                                    applicationService.getCertifyApps($scope.contextVal, $(event.item).attr('attr-id')).then(function(resp) {
                                        if(resp.isSuccess) {
                                            $compile(event.contentElement)($scope);
                                            $scope.bacrConfig.updateGrid(resp.response);
                                        }
                                    });
                                }
                                if (event.item.textContent.indexOf('Infrastructure') > -1) {
                                    var deferred = $q.defer();
                                    require(['app-infra-wrapper-tab'], function () {
                                        $scope.$apply(function () {
                                            deferred.resolve($scope.$on('$destroy', $compile(event.contentElement)($scope)));
                                        });
                                    });
                                    return deferred.promise;
                                }
                            }
                        }).data("kendoTabStrip");

                        tabStrip.select(0);
                    };

                    applicationService.getAppRecords().then(function (resp) {
                        var _mcps = resp[0];
                        var _mcpsObj = _.object(_.pluck(_mcps, 'CODE'), _mcps);
                        var data = leftJoin(resp[1], _mcpsObj); //multipleRecord.apps;
                        applicationService.getAllApplicationFeedbackCount().then(
                            function (feedbackResp) {
                                var _feedbackCountObj = _.object(_.pluck(feedbackResp, 'ID'), feedbackResp);
                                _.each(data, function (litem) {
                                    var _cnt = _feedbackCountObj[litem.APP_ID];
                                    litem.COUNT = (undefined === _cnt) ? 0 : _cnt.COUNT;
                                    for(var j in litem) {
                                        litem[j] =litem[j]!=null && typeof litem[j]!="object"?litem[j]: Array.isArray(litem[j]) ? litem[j] : "";
                                    }
                                });
                                var customGroupData = appConfig.getCustomGroupConfigureData();
                                $scope.groupingPlugin =
                                {
                                    columns: customGroupData,
                                    activeGroupColumns: []
                                };

                                var _confColumnsModel = {
                                    context: 'APPLICATION',
                                    createdBy: authenticationFactory.getUserName()
                                };
                                applicationService.getUserPreferences(_confColumnsModel).then(function (columnPref) {
                                    var _filterData = _.where(columnPref.info, {key: "filter"});
                                    _.each(_filterData, function(val,idx){
                                        val.isDuplicate = val.data[0].operator === 'DUPLICATE';
                                    });
                                    $scope.filteringPlugin = {
                                        columns: customGroupData
                                    };
                                    $scope.filterPreferences  = _filterData ? _filterData : [];
                                });
                                jsonData = data;
                                $scope.config.updateGrid(data);
                            },
                            function (error) {
                                jsonData = data;
                                $scope.config.updateGrid(data);
                                console.log('application feedback Count failed..' + error);
                            }
                            );
                        applicationService.getAllApplicationCertificationCount($scope.contextVal).then(
                            function (certificationResp) {
                                var _certificationCountObj = certificationResp;//_.object(_.pluck(certificationResp, 'ID'), certificationResp);
                                _.each(data, function (litem) {
                                    var _cntCertify = 0;
                                    var _cntReject = 0;
                                    var _item = _.where(_certificationCountObj, {identifier: litem.APP_ID.toString()});
                                    _.each(_item, function(citem){
                                        switch(citem.status){
                                            case true: _cntCertify += 1; break;
                                            case false:
                                            default: _cntReject += 1; break;
                                        }
                                    });
                                    litem.CertificationCount = _cntCertify;
                                    litem.CertificationRejectCount = _cntReject;
                                    litem.CertificationTotalCount = _cntCertify + _cntReject;
                                });
                                jsonData = data;
                                $scope.config.updateGrid(data);
                            },
                            function (error) {
                                jsonData = data;
                                $scope.config.updateGrid(data);
                                console.log('application feedback Count failed..' + error);
                            }
                        );
                    },
                        function (error) { console.log('application service failed..' + error); }
                    );

                    if ($routeParams.id) {
                        $scope.filteredState = true;
                        $scope.config.pageable = false;
                        $scope.config.dataSource.filter = _appConfigs.routeParamFilter($routeParams.id);
                    }

                };

                $scope.filterGridRecord = function (text) {
                    var _appConfigs = appConfig.getConfigs();
                    $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
                }
                var popupInfo = {
                    process:
                        {
                            templateUrl: appConstantPath.application.multiProcessTemplateUrl,
                            routePath: '/mcps/'
                        },
                    lob: {
                        templateUrl: appConstantPath.application.multiLobsTemplateUrl,
                        routePath: '/lobs?name='
                    }
                }
                $rootScope.routeToProcess = function (option, id) {
                    popupService.closePopup();
                    var _routeUrl = popupInfo[option].routePath + id;
                    $location.url(_routeUrl, true);
                }

                $("div.gridRequiredClass").on('click', 'a.processLinkMultiple', function (e) {
                    $rootScope.selectedItem = $("#grid").data("kendoGrid").dataItem($(this).closest("tr"));
                    popupService.showApplicationPopup(popupInfo['process'].templateUrl);
                });

                $("div.gridRequiredClass").on('click', 'a.lobLinkMultiple', function (e) {
                    $rootScope.selectedItem = $("#grid").data("kendoGrid").dataItem($(this).closest("tr"));
                    popupService.showApplicationPopup(popupInfo['lob'].templateUrl);
                });

                $("div.gridRequiredClass").on('click', 'a.processDetailMultiple', function (e) {
                    $rootScope.selectedItem = $("#grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr").prev('tr'));
                    popupService.showApplicationPopup(popupInfo['process'].templateUrl);
                });

                $("div.gridRequiredClass").on('click', 'a.lobDetailMultiple', function (e) {
                    $rootScope.selectedItem = $("#grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr").prev('tr'));
                    popupService.showApplicationPopup(popupInfo['lob'].templateUrl);
                });

                $("div.gridRequiredClass").on('click', 'span.bacr', function (e) {
                    var _rowInfo = $("#grid").data("kendoGrid").dataItem($(this).closest("tr"));
                    appConfig.clearApplication();
                    appConfig.setApplication(_rowInfo);
                    var deferred = $q.defer();
                    require([appConstantPath.application.applicationSystemInfoControllerUrl], function () {
                        $rootScope.$apply(function () {
                            deferred.resolve(popupService.showApplicationBacrPopup(appConstantPath.application.bacrTemplateUrl));
                        });
                    });
                    return deferred.promise;
                });
                $("div.gridRequiredClass").on('click', 'span.appBacr', function (e) {
                    var _rowInfo = $("#certifyGrid").data("kendoGrid").dataItem($(this).closest("tr"));
                    appConfig.clearApplication();
                    applicationService.getCertifyAppData({identifier: _rowInfo.identifier, version: _rowInfo.version, context: $scope.contextVal}).then(function(resp) {
                        var appData  = resp.response.recordData;
                        appData['comment'] = resp.response.comment;
                        appData['oldData'] = true;
                        appConfig.setApplication(appData);
                        var deferred = $q.defer();
                        require([appConstantPath.application.applicationSystemInfoControllerUrl], function () {
                            $rootScope.$apply(function () {
                                deferred.resolve(popupService.showApplicationBacrPopup(appConstantPath.application.bacrTemplateUrl));
                            });
                        });
                        return deferred.promise;
                    });
                });

                $("div.gridRequiredClass").on('click', 'a.systemInfo', function (e) {
                    $rootScope.selectedItem = $("#grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
                    $rootScope.appId = $rootScope.selectedItem.APP_ID;
                    var deferred = $q.defer();
                    require([appConstantPath.application.applicationSystemInfoControllerUrl], function () {
                        $rootScope.$apply(function () {
                            deferred.resolve(popupService.showApplicationSystemInfoPopup(appConstantPath.application.appSystemInfoTemplateUrl));
                        });
                    });
                    return deferred.promise;
                });


                $scope.updateFeedbackCount = function (appId, count) {
                    angular.forEach($('#grid').data().kendoGrid.dataSource.data(), function (application) {
                        if (application.APP_ID == appId) {
                            application.COUNT = count;
                        }
                    });
                    var countElements = $(".feedbackCount" + appId);
                    countElements.html(count);
                    countElements.parent().removeClass("hide");
                };
                $scope.callbackFilter = function(customFilter){
                    filterInfo.pluginFilters = customFilter;
                    normalPluginFilterLogic();
                };

            }]);
    });
})($, angular);