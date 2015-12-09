/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'jsondiffpatch','jsondiffpatch-formatters', 'grid-grouping', 'grid-filtering', 'filter-options', 'kendo-plugin','angularjs-dropdown-multiselect', 'site-utility-module-services', 'utility-model-grid-configs'], function (app, jsondiffpatch, formatters) {
        app.register.controller('sitesUtilityModuleController', ['$scope', '$rootScope', 'siteUtilityModuleServices', 'utilityModelGridConfigs', 'isMobileView', '$compile', '$q', 'popupService', '$timeout', 'authenticationFactory', 'notifyService', 'besDefaultColumns',
            function ($scope, $rootScope, siteUtilityModuleServices, utilityModelGridConfigs, isMobileView, $compile, $q, popupService, $timeout, authenticationFactory, notifyService, besDefaultColumns) {
                $scope.columns = [];
                var allTabs = [];
                $scope.selectedCols = [];
                $scope.colsList = [];
                $scope.savePrefEnabled = false;
                $scope.colsSettings = {
                    enableSearch: true,
                    scrollableHeight: '500px',
                    scrollable: true,
                    showCheckAll: false,
                    showUncheckAll: false
                };
                var jsonData = [];
                var maxColLength = 45;
               /* var _actionField = {
                    title: "Actions", resizable: true, filterable: false, groupable: false, template: function appTemplate(data) {
                        if(!data.notify)
                            return '<span class="watch icon-watch-add" title="Add Watch">Add</span>';
                        else
                            return '<span class="watch icon-watch-remove" title="Remove Watch">Remove</span>';
                    },
                    width: 90,
                    attributes: {
                        "class": "action-column"
                    }
                };*/
                var _groupsData = [];
                var controlDataFields = ['SiteName','HighestCIPV5BCSImpactRating','FutureV5BCSImpactRating','ExpectedDateforFutureV5BCSImpactRatingEDRO',
                    'CIPV3CARating','SiteSecurityTypeandProfileFutureUse','SiteCategoryType','_11ReliabilityCoordinator','_12BalancingAuthority','_13TOAssetsmeetcriterion222425272829or210',
                    '_14GOAssetsmeetcriterion212326or29','_211GO1500MW','_212TOnotHighisMed','_213BA1500MW','_31LowBA1500MW','Details','SiteType'];
                var substationSupporting = ['SiteName','HighestCIPV5BCSImpactRating','FutureV5BCSImpactRating','ExpectedDateforFutureV5BCSImpactRatingEDRO',
                    'CIPV3CARating','SiteSecurityTypeandProfileFutureUse','_36Fromsection421Low','_35SPSLow','_34RestorationsystemsLow','_32TransmissionstationsandsubstationsLow',
                    '_28RequiredforGenerationSiteInterconnection','_27NuclearPlantInterfaceOPO23','_26CriticalforIROLs','_25bWeightedlineAveragesum',
                    '_25a200kV299kV230kVonly','_25MedCriteriaapplies','_24500kVorhigher','_210AutomaticLoadShedding',
                    '_29SpecialProtectionSystemSPSorRemedialActionSchemeRAS','_22MedCriteriaapplies',
                    '_22cShuntReactorsTotalCapacityMVA','_22dShuntReactorCyberComponent','_22bCapBankCyberComponent',
                    '_22aCapacitorBanksTotalCapacityMVA','MaximumkV','SiteType'];
                var generation = ['SiteName','HighestCIPV5BCSImpactRating','FutureV5BCSImpactRating','ExpectedDateforFutureV5BCSImpactRatingEDRO',
                    'CIPV3CARating','SiteSecurityTypeandProfileFutureUse','GenerationType','_21Generationexceeding1500MWinasingleInterconnection',
                    '_23Impactintheplanninghorizonofmorethanoneyear','_33GenerationResources','SiteType'];
                var disabledAdvancedOptions = ['EACMS','PACS','ChangeLog'];
                var disabledGridColumnPref = ['ChangeLog'];
                var sheetsWithMergedData = ['EACMS','PACS'];
                var _height = 670;
                //var _defaultHeightSet = false;
                $scope.colsTranslationTexts = {
                    selectionCount: 'Selected',
                    dynamicButtonTextSuffix: 'Selected'
                };
                $scope.colsEvents = {
                    onItemSelect: function(item) {
                        var col = _.where($scope.colsList, {id: item.id})[0];
                        var _title = col.label;
                        _title = _title.length > maxColLength ? _title.substring(0,maxColLength-1) + '...': _title;
                        $scope.columns.push({
                            field: col.id,
                            title: _title,
                            groupable: false,
                            filterable: {
                                extra: false
                            },
                            groupHeaderTemplate: col.label + ": #= value # (Count: #= count#)",
                            headerAttributes:{
                                title: col.label,
                                style: 'min-width: 150px'
                            }
                        });
                        var _gridFields = [].concat($scope.columns);
                        //Add actions field in the columns list
                        //_gridFields.push(_actionField);
                        $scope.config.refreshGrid(_gridFields);
                        var activeCol = ($scope.groupingPlugin && $scope.groupingPlugin.activeGroupColumns) ? $scope.groupingPlugin.activeGroupColumns : null;
                        if(activeCol){
                            $('#grid').getKendoGrid().dataSource.group(activeCol);
                        }
                        $scope.savePrefEnabled = (!angular.equals($scope.groupingPlugin.activeGroupColumns, $scope.initialSelectedGroup) || !angular.equals($scope.selectedCols, $scope.initialSelectedCols));
                    },
                    onItemDeselect: function(item){
                        for (var index = 0; index < $scope.columns.length; index++) {
                            // If current array item equals itemToRemove then
                            if ($scope.columns[index].field === item.id) {
                                // Remove array item at current index
                                $scope.columns.splice(index, 1);
                                break;
                            }
                        }
                        var _gridFields = [].concat($scope.columns);
                        //Add actions field in the columns list
                      //  _gridFields.push(_actionField);
                        $scope.config.refreshGrid(_gridFields);
                        var activeCol = ($scope.groupingPlugin && $scope.groupingPlugin.activeGroupColumns) ? $scope.groupingPlugin.activeGroupColumns : null;
                        if(activeCol){
                            for(var i = activeCol.length; i--;){
                                if (item.id === activeCol[i].field) {
                                    activeCol.splice(i, 1);
                                }
                            }
                            $('#grid').getKendoGrid().dataSource.group(activeCol);
                        }
                        $scope.savePrefEnabled = (!angular.equals($scope.groupingPlugin.activeGroupColumns, $scope.initialSelectedGroup) || !angular.equals($scope.selectedCols, $scope.initialSelectedCols));
                    }
                };

                $scope.initializeController = function () {
                    $scope.indexActive = 0;
                    $scope.config = utilityModelGridConfigs.getConfigs();
                    $scope.config.height = _height; // Initial
                    $scope.config.detailTemplate = kendo.template($("#template").html());
                    $scope.config.detailInit = function (e) {
                        var detailRow = e.detailRow;
                        var dataItem = e.data;
                        var _model = {};
                        var configuredCols = [];
                        var generalItem = angular.extend({}, dataItem);
                        for(var i = 0 ; i < $scope.columns.length; i++){
                            configuredCols.push($scope.columns[i].field);
                            if(generalItem[$scope.columns[i].field]) {
                                delete generalItem[$scope.columns[i].field];
                            }
                        }
                        // In case of Sites, show only SiteType specific elements
                        if($scope.activeTabInfo.sheetName === 'Site'){
                            var siteType = dataItem['SiteType'];
                            if(siteType){
                                siteType = $.trim(siteType.toLowerCase());
                            }else{
                                siteType = '';
                            }
                            switch(siteType){
                                case 'control center':
                                case 'data center':
                                    Object.keys(generalItem).forEach(function (key) {
                                        if($.inArray(key, controlDataFields) < 0)
                                            delete generalItem[key];
                                    });
                                    break;
                                case 'substation':
                                case 'support site':
                                    Object.keys(generalItem).forEach(function (key) {
                                        if($.inArray(key, substationSupporting) < 0)
                                            delete generalItem[key];
                                    });
                                    break;
                                case 'generation':
                                    Object.keys(generalItem).forEach(function (key) {
                                        if($.inArray(key, generation) < 0)
                                            delete generalItem[key];
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                        _model['generalItem'] = generalItem;
                        _model['sheetName'] = $scope.activeTabInfo.sheetName;
                        _model['key'] = $scope.activeTabInfo.primaryKey;
                        var _title = '';
                        _.each($scope.activeTabInfo.primaryKey, function(val,idx){
                            if(_title === ''){
                                _title = $rootScope.cols[val] + ':' + dataItem[val];
                            }else{
                                _title = _title + '; ' + $rootScope.cols[val] + ':' + dataItem[val];
                            }
                        });
                        _model['title'] = _title;
                        _model['rowData'] = dataItem;
                        _model['cols'] = $rootScope.cols;
                        var dynamicGroups = [].concat(_groupsData);
                        if(_groupsData && _groupsData.length > 0){
                            _.each(_groupsData, function(item, idx){
                                _.each(item.dataObject, function(val, i){
                                   configuredCols.push(val);
                                });
                            });
                            var allCols = _.pluck($scope.colsList, 'id');
                            var newCols = _.filter(_.keys(generalItem), function(item, index){
                                return $.inArray(item, configuredCols) === -1;
                            });
                            if(newCols.length > 0){
                                dynamicGroups.splice(0, 0, {groupName: 'General', dataObject: newCols});
                            }
                        }else{
                            var newCols = {};
                            _.each(_.keys(generalItem), function(item, index){
                                if($.inArray(item, configuredCols) === -1){
                                    newCols[item] = item;
                                }
                            });
                            if(_.keys(newCols).length > 0) {
                                dynamicGroups.push({groupName: 'General', dataObject: newCols});
                            }
                        }
                        _model['groupsData'] = dynamicGroups;
                        var tabStrip = detailRow.find(".detailTabstrip").kendoTabStrip({
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
                        var tabOptions = {};
                        tabOptions['dynamicGroups'] = dynamicGroups;
                        tabOptions['showHistory'] = $.inArray($scope.activeTabInfo.sheetName, sheetsWithMergedData) === -1;
                        tabOptions['showFeedback'] = $.inArray($scope.activeTabInfo.sheetName, sheetsWithMergedData) === -1;
                        tabOptions['showVersionComparer'] = $.inArray($scope.activeTabInfo.sheetName, sheetsWithMergedData) === -1;
                        utilityModelGridConfigs.setTabConfigs(tabOptions, _model);
                        var _tabContent = utilityModelGridConfigs.getTabConfigs();
                        angular.forEach(_tabContent, function(item){ tabStrip.append(item); });
                        tabStrip.select(0);
                    };
                    $scope.config.dataBound = function(e){
                        if($scope.activeTabInfo && $scope.activeTabInfo.sheetName) {
                            if($.inArray($scope.activeTabInfo.sheetName, disabledGridColumnPref) > -1){
                                //remove hierarchy cells and column
                                $(".k-hierarchy-cell").remove();
                                $(".k-hierarchy-col").remove();
                            }
                            if ($.inArray($scope.activeTabInfo.sheetName, sheetsWithMergedData) > -1) {
                                $('#grid').find('tbody tr.k-grouping-row').next('tr').css({
                                    'font-style': 'italic',
                                    'font-weight':'bold',
                                    'background-color':'#ebf4fa'
                                });
                                $('#grid').find('tbody tr.k-grouping-row').next('tr').find('span.watch').hide();
                            }
                            collapseAllGroups(this);
                        }
                    };
                    var collapseAllGroups = function (grid) {
                        grid.table.find(".k-grouping-row").each(function () {
                            grid.collapseGroup(this);
                        });
                        var firstGroup = grid.table.find(".k-grouping-row").first();
                        grid.expandGroup(firstGroup);
                    };
                    var expandedRow;
                    $scope.config.detailExpand = function(e){
                        e.detailRow.find(".detailTabstrip").data('kendoTabStrip').select(0);
                        $(".open").removeClass("open");
                        $("ul.dropdown-menu.dropdown-menu-form").css("display", "none");
                        if (expandedRow != null && expandedRow[0] != e.masterRow[0]) {
                            $('#grid').data("kendoGrid").collapseRow(expandedRow);
                        }
                        expandedRow = e.masterRow;
                    };
                    if(isMobileView){
                        $scope.config.groupable = !isMobileView;
                    }else {
                        $scope.config.groupable = {
                            messages: {
                                empty: ""
                            }
                        };
                    }
                    siteUtilityModuleServices.getUtilityInfo().then(function(response){
                        allTabs =  _.object(_.pluck(response, 'sheetName'), response);
                        $scope.allTabs = response;
                        var findObj = _.where($scope.allTabs, {order: 1});
                        if(findObj.length > 0)
                            $scope.callActiveTab(0, findObj[0].sheetName);
                        else
                            $scope.savePrefEnabled = false;
                    });
                }

                function getOnlyJsonVariables(oldJson){
                    var _newJson = {};

                    angular.forEach(oldJson, function(item, key){
                        if(typeof oldJson[key] !== 'function'){
                            _newJson[key] = item;
                        }else{
                        }
                    });
                   return _newJson;
                }

                $scope.callActiveTab = function(index, sheetName) {
                    //$scope.filteringPlugin = { columns: [] };
                    // Save user preferences on tab switching
                    if($scope.savePrefEnabled){
                        $scope.saveUserCols();
                    }
                    $scope.indexActive = index;
                    $scope.activeTabInfo = allTabs[sheetName];
                    $('#txtSearchString')[0].placeholder = 'Search in ' + allTabs[sheetName].displayName;
                    loadUtilityData($scope.activeTabInfo.sheetName);
                };
                function loadUtilityData(sheetName){
                    var _reqModel = {
                        sheetName: sheetName,
                        user: authenticationFactory.getUserName()
                    };
                    siteUtilityModuleServices.loadUtilityData(_reqModel).then(function (response) {
                        var json = response;
                        jsonData = json;
                        if (!json)
                            return;
                        var _findObj = _.find(allTabs, {sheetName: sheetName});
                        if(!_findObj){
                            return;
                        }
                        _groupsData = [];
                        $scope.recordDate = _findObj.dataUpdated;
                        var _columns = [];
                        var _selectedCols = [];
                        var _colsList = [];

                        _.each(_findObj.primaryKey, function(val,idx){
                            var _title = _findObj.headers[val];
                            _title = _title.length > maxColLength ? _title.substring(0,maxColLength-1) + '...': _title;
                            var jsonColData = {
                                field: val,
                                title: _title,
                                groupable: false,
                                filterable: {
                                    extra: false
                                },
                                headerAttributes:{
                                    title: _findObj.headers[val],
                                    style: 'min-width: 150px'
                                }
                            };
                            if($.inArray(sheetName, sheetsWithMergedData) === -1) {
                                jsonColData.groupHeaderTemplate = _findObj.headers[val] + ": #= value # (Count: #= count#)";
                                /*if(sheetName !== 'ChangeLog') {
                                    jsonColData.template = function (data) {
                                        return (!data.notify ? ' <span class="watch icon-watch-add" title="Add Watch">Add</span>&nbsp;&nbsp;' :
                                                ' <span class="watch icon-watch-remove" title="Remove Watch">Remove</span>&nbsp;&nbsp;') + data[val];
                                    };
                                }*/
                            }else{
                                if(idx === 0) {
                                    jsonColData.hidden = true;
                                }
                            }
                            _columns.push(jsonColData);
                            _selectedCols.push({
                                id: val,
                                label: _findObj.headers[val],
                                disabled: true
                            });
                        });

                        _.each(_findObj.headers, function (key, value) {
                            _colsList.push({
                                id: value,
                                label: _findObj.headers[value]
                            });
                        });
			            //_colsList.reverse();
                        //Configurable Columns
                        var _primaryData;
                        _.each(_findObj.groupData, function(value, index) {
                            if (value.groupName !== 'Primary') {
                                _groupsData.push(value);
                            } else {
                                _primaryData = value;
                            }
                        });

                        var _confColumnsModel = {
                            context: $scope.activeTabInfo.sheetName,
                            //identifier: 'primary',
                            createdBy: authenticationFactory.getUserName()
                        };
                        siteUtilityModuleServices.getUserPreferences(_confColumnsModel).then(function (columnPref) {
                            var _columnPrefSet = false;
                            var _columData = _.where(columnPref.info, {key: "columns"});
                            //var _columData = columnPref.info.data.columns;
                            //var _groupData = columnPref.info.data.group ? columnPref.info.data.group : [];
                            //var _filterData = columnPref.info.data.filter ? columnPref.info.data.filter : [];
                            var _groupData = _.where(columnPref.info, {key: "group"});
                            var _filterData = _.where(columnPref.info, {key: "filter"});
                            _groupData = _groupData.length > 0 && $.inArray(sheetName, sheetsWithMergedData) === -1 ? _groupData[0].data : [];
                            //var _filterData = _.where(columnPref.info, {key: "filter"});
                            if(_columData.length > 0 && $.inArray(sheetName, disabledGridColumnPref) === -1) {
                                _columnPrefSet = true;
                                _.each(Object.keys(_columData[0].data), function (key, value) {
                                    var findObj = _.where(_selectedCols, {id: key});
                                    var colObj = _.where(_colsList, {id: key});
                                    var _title = _columData[0].data[key];
                                    _title = _title.length > maxColLength ? _title.substring(0,maxColLength-1) + '...': _title;
                                    if(findObj.length === 0 && colObj.length > 0) {
                                        _columns.push({
                                            field: key,
                                            title: _title,
                                            groupable: false,
                                            filterable: {
                                                extra: false
                                            },
                                            groupHeaderTemplate: _columData[0].data[key] + ": #= value # (Count: #= count#)",
                                            headerAttributes:{
                                                title: _columData[0].data[key],
                                                style: 'min-width: 150px'
                                            }
                                        });
                                        _selectedCols.push({id: key, label: _columData[0].data[key]});
                                    }
                                    $("a.dropdown-toggle").bind("click", function () {

                                        $("ul.dropdown-menu.dropdown-menu-form").css("display", "none");
                                    });
                                });
                            }else{
                                // Column Preferences not saved - Set to default column view from Config
                                var defaultCols = _.find(besDefaultColumns, {sheetName: sheetName});
                                _.each(defaultCols.defaultColumns, function (value, index) {
                                    var findObj = _.where(_selectedCols, {id: value.id});
                                    var _title = value.label;
                                    _title = _title.length > maxColLength ? _title.substring(0,maxColLength-1) + '...': _title;
                                    if(findObj.length === 0 && _selectedCols.length <= 4) {
                                        _columns.push({
                                            field: value.id,
                                            title: _title,
                                            groupable: false,
                                            filterable: {
                                                extra: false
                                            },
                                            groupHeaderTemplate: value.label + ": #= value # (Count: #= count#)",
                                            headerAttributes:{
                                                title: value.label,
                                                style: 'min-width: 150px'
                                            }
                                        });
                                        _selectedCols.push({id: value.id, label: value.label});
                                    }
                                });
                            }
                            $scope.columnPrefSet = _columnPrefSet;
                            $scope.selectedCols = _selectedCols;
                            $scope.initialSelectedGroup = [].concat(_groupData);
                            $scope.initialSelectedCols = [].concat(_selectedCols);
                            $scope.colsList = _colsList;
                            $scope.columns = _columns;
                            $scope.savePrefEnabled = false;
                            $scope.hideGridColumnPref = $.inArray(sheetName, disabledGridColumnPref) > -1;
                            _.each(_filterData, function(val,idx){
                                val.isDuplicate = val.data[0].operator === 'DUPLICATE';
                            });
                            $scope.filteringPlugin = {
                                columns: $scope.columns
                            };
                            $scope.filterPreferences = _filterData? _filterData:[];
                            $rootScope.cols = _findObj.masterheaders;
                            var _gridFields = [].concat($scope.columns);
                            //Add actions field in the columns list
                           // _gridFields.push(_actionField);
                            $scope.config.refreshGrid(_gridFields);
                            $scope.config.updateGrid(jsonData);
                            $scope.groupingPlugin = {
                                columns: $scope.columns,
                                activeGroupColumns: _groupData ? _groupData:[]
                            };
                            /*if(_groupData){
                                //$scope.groupingPlugin.activeGroupColumns.push(_groupData);
                                $('#grid').getKendoGrid().dataSource.group(_groupData);
                            }*/

                            if($.inArray(sheetName, sheetsWithMergedData) > -1) {
                                $scope.groupingPlugin.activeGroupColumns.push($scope.columns[0]);
                                var activeCol = ($scope.groupingPlugin && $scope.groupingPlugin.activeGroupColumns) ? $scope.groupingPlugin.activeGroupColumns : null;
                                if(activeCol){
                                    $scope.initialSelectedGroup = [].concat(activeCol);
                                    $('#grid').getKendoGrid().dataSource.group(activeCol);
                                    $('#grid').getKendoGrid().dataSource.sort({field:'order',dir:'asc'});
                                    $('#grid').getKendoGrid().dataSource.pageSize(json.length);
                                    var pageable = {
                                        refresh: false,
                                        input: true,
                                        numeric: false,
                                        pageSize: json.length,
                                        pageSizes: [json.length]
                                    };
                                    $('#grid').getKendoGrid().setOptions({pageable: pageable});
                                    $('#grid').getKendoGrid().setOptions({sortable: false});
                                }
                            }else{
                                $('#grid').getKendoGrid().dataSource.pageSize(20); // Reset to default
                                var pageable = {
                                    refresh: false,
                                        input: true,
                                        numeric: false,
                                        pageSize: 20,
                                        pageSizes: [20, 50, 100, 200]
                                };
                                $('#grid').getKendoGrid().setOptions({pageable: pageable});
                                $('#grid').getKendoGrid().setOptions({sortable: true});
                            }
                            $scope.hideGridAdvancedOptions = $.inArray(sheetName, disabledAdvancedOptions) > -1;
                            //setGridHeight();
                        });
                    });

                }

                /*function setGridHeight(){
                    if(!_defaultHeightSet) {
                        _height = Math.abs($('.assetIT-footer').position().top) - Math.abs($('.k-tabstrip-items').position().top) - 92 - Math.abs($('.assetIT-footer').height()) - Math.abs($('.grouping-filter').height());
                    }
                    $('#grid').getKendoGrid().setOptions({
                        height: _height
                    });
                    _defaultHeightSet = true;
                }*/
                var filterInfo = {
                    searchFilters:{},
                    pluginFilters:{}
                };
                var _searchTextData='';
                $scope.filterGridRecord = function (text) {
                    _searchTextData = text;
                     filterInfo.searchFilters = utilityModelGridConfigs.getDefaultFilterWithFilterText(text, $scope.columns);
                    normalPluginFilterLogic();
                    $scope.highlight(text);
                };

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
                        $scope.config.updateGrid(jsonData);
                        $scope.filterGridByFilterPlugin(resultFilter);
                    }
                }

                $scope.callbackFilter = function(customFilter){
                    filterInfo.pluginFilters = customFilter;
                    normalPluginFilterLogic();
                };

                $scope.callbackGroup = function(){
                    $scope.savePrefEnabled = (!angular.equals($scope.groupingPlugin.activeGroupColumns, $scope.initialSelectedGroup) || !angular.equals($scope.selectedCols, $scope.initialSelectedCols));
                    //_defaultHeightSet = false;
                    //setGridHeight();
                    /*if($scope.groupingPlugin.activeGroupColumns.length > 0) {
                        $('#grid').getKendoGrid().dataSource.pageSize(jsonData.length);
                        $('#grid').getKendoGrid().setOptions({pageable: false});
                    }else{
                        $('#grid').getKendoGrid().dataSource.pageSize(20); // Reset to default
                        var pageable = {
                            refresh: false,
                            input: true,
                            numeric: false,
                            pageSize: 20,
                            pageSizes: [20, 50, 100, 200]
                        };
                        $('#grid').getKendoGrid().setOptions({pageable: pageable});
                    }*/
                };

                $scope.updateFeedbackCount = function (appId, count)
                {
                };

                $("a.dropdown-toggle").on("click", function () {
                       $("ul.dropdown-menu.dropdown-menu-form").css("display", "none");
                });

                $scope.saveUserCols = function(){
                    var _confColumnsModel = {
                        context: $scope.activeTabInfo.sheetName,
                        identifier: 'primary',
                        createdBy: authenticationFactory.getUserName(),
                        data: {
                            columns: {},
                            group: {}
                        }
                    };
                    if($.inArray($scope.activeTabInfo.sheetName, sheetsWithMergedData) === -1) {
                        _confColumnsModel.data.group = $scope.groupingPlugin.activeGroupColumns;
                    }
                    _.each($scope.selectedCols, function (key, value) {
                        if (!key.disabled)
                            _confColumnsModel.data.columns[key.id] = _.where($scope.colsList, {id: key.id})[0].label;
                    });
                    //UPDATE
                    siteUtilityModuleServices.updateUserPreferences(_confColumnsModel).then(function (columnPref) {
                        $scope.initialSelectedCols = [].concat($scope.selectedCols);
                        $scope.savePrefEnabled = false;
                        notifyService.notifySuccess(
                            {
                                title: 'Asset Management Platform',
                                text: 'Saved user preferences',
                                type: 'success'
                            }
                        );
                    });
                };

                /* Watch List */
                $("div.gridRequiredClass").on('click', 'span.watch', function (e) {
                    var $this = $(this);
                    var _rowInfo = $("#grid").data("kendoGrid").dataItem($this.closest("tr"));
                    var _findObj = _.find(allTabs, {sheetName: $scope.activeTabInfo.sheetName});
                    if(_findObj){
                        var _condition = {};
                        _.each(_findObj.primaryKey, function(item,index){
                            _condition[item] = _rowInfo[item];
                        });
                        var model = {
                            sheetName: _findObj.sheetName,
                            user: authenticationFactory.getUserName(),
                            keys: _condition
                        };
                        if(!_rowInfo.notify || $this.hasClass('icon-watch-add')) {
                            siteUtilityModuleServices.addUserWatchList(model).then(function (watch) {
                                if(watch.isSuccess) {
                                    _rowInfo.notify = true; // On success
                                    notifyService.notifySuccess(
                                        {
                                            title: 'Asset Management Platform',
                                            text: 'Added to watch list',
                                            type: 'success'
                                        }
                                    );
                                    $this.removeClass('icon-watch-add').addClass('icon-watch-remove').attr('title','Remove watch');
                                }
                            });
                        }else{
                            siteUtilityModuleServices.removeUserWatchList(model).then(function (watch) {
                                if(watch.isSuccess) {
                                    _rowInfo.notify = false; // On success
                                    notifyService.notifySuccess(
                                        {
                                            title: 'Asset Management Platform',
                                            text: 'Removed watch list',
                                            type: 'success'
                                        }
                                    );
                                    $this.removeClass('icon-watch-remove').addClass('icon-watch-add').attr('title','Add watch');
                                }
                            });
                        }
                    } else{
                        return;
                    }
                });

            }]);
    });
})();
