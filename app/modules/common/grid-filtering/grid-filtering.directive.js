/**
 * Created by wizdev on 8/7/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'authentication-factory', 'bootstrap', 'bootstrap-popup'], function (app) {
        app.register.directive('gridFiltering', ['filterPluginModel', 'gridFilteringService', '$timeout', 'popupService', function (filterPluginModel, gridFilteringService, $timeout, popupService) {
            return {
                restrict: "AE",
                templateUrl: 'app/modules/common/grid-filtering/grid-filtering.html',
                scope:{
                    context:'=',
                    identifier:'@',
                    key:'@',
                    createdBy:'@',
                    options:'=',
                    callbackFilter:'&?',
                    filterPreferences:'='
                },
                link: function ($scope, element, attrs) {
                    element.find('.dropdown-menu').click(function(e) {
                        e.stopPropagation();
                    });
                    element.find('.openContainer').click(function(e) {
                        //$scope.getUserPrefs();
                    });
                },
                controller:function($scope){
                    var filterModel, form, performFormOperations, performOperations, performOps;

                    function init(){
                        performFormOperations = {
                            createPrefs:{ callbackFunc: submitFilterForm},
                            updatePrefs:{ callbackFunc: updateFilterForm},
                            applyPrefs : {callbackFunc : applyFilterToParentScope}
                        };
                        performOperations = {
                            getPrefs:{ callbackFunc: getUserPrefs },
                            deletePrefs:{ callbackFunc: removeUserPreferences },
                            applyCallbackFunc:applyFilterToGrid
                        };
                        filterModel = filterPluginModel.configurations;
                        filterModel.initializeDefaultModel();
                        filterModel.setConfigurations(performOperations); //Set Preferences for service callback


                        form = filterPluginModel.formConfigurations;
                        form.setConfigurations(performFormOperations); //Set Preferences for service callback
                        if(form && form.form && form.form.showForm){
                            // Hide the create form during initialization
                            form.form.showForm = false;
                        }
                        $scope.filterForm = form; //Register Create and Update event to form

                        performOps = {
                            create:{service: gridFilteringService.addUserPreferences, pluginModel:filterModel, method:'pushData'},
                            update:{service: gridFilteringService.updateUserPreferences, pluginModel:filterModel, method:'updateData'}
                        };

                        $scope.clearGridFilters();
                    }

                    function applyFilterToGrid(_finalFilter){
                        $scope.$evalAsync($scope.callbackFilter()(_finalFilter));
                    }

                    $scope.clearGridFilters = function(){
                        filterModel.setdefaultPreference();
                        $scope.$evalAsync($scope.callbackFilter()({}));
                    }

                   function commonFunc (model, _filterPrefmodel){
                       var _postModel = _filterPrefmodel.modelToPost;
                       model.service(_postModel).then(function(resp){
                           $scope.message = '';
                           $scope.filterForm.form.showForm = !$scope.filterForm.form.showForm;
                           var _configurations = model.pluginModel[model.method]({name:_postModel.identifier, data: _postModel.data});
                           $scope.activePreference = _configurations.activePreference;
                           $scope.filterableViewData = validateFormViewData(_configurations.info);
                           applyFilterToParentScope(_filterPrefmodel);
                       }, showError );
                    };

                    function submitFilterForm(_filterPrefmodel){
                        var isValidForm  = form.validateForm();
                        if(isValidForm){
                            commonFunc(performOps.create, _filterPrefmodel);
                        }else{
                            $('.error').html('Same name already exist. Please change filter name..');
                            $timeout(function(){
                                $('.error').html('');
                            }, 2000);
                        }
                    }

                    function updateFilterForm(_filterPrefmodel){
                        commonFunc(performOps.update, _filterPrefmodel);
                    }

                    function showError(error){
                        console.log(error);
                    }

                    function manipulateInfo(){
                        $scope.message = '';
                        if($scope.filterPreferences && $scope.filterPreferences.length > 0) {
                            createAndSetEntityModelToScope($scope.filterPreferences);
                        }else{
                            createAndSetEntityModelToScope([]);
                            $scope.message = 'No filter created';
                        }
                    }

                    function createAndSetEntityModelToScope(info){
                        if(info && null != info) {
                            var _configurations = filterModel.setDataAndCreateFilterModel(info);
                            $scope.activePreference = _configurations.activePreference;
                            $scope.filterableViewData = validateFormViewData(_configurations.info);
                        }else{
                            $scope.filterableViewData = [];
                        }
                    }

                    function validateFormViewData(info){
                        _.each(info, function(data, key){
                            _.each(data.data, function(d,k){
                                var _findObj = _.where($scope.filterPlugin.columns, {field: d.field});
                                if(_findObj.length === 0){
                                    d.field = "";
                                    data.isValid = false;
                                }else{
                                    data.isValid = true;
                                }
                            });
                        });

                        return info;
                    };

                    function getUserPrefs(filterPrefmodel){
                        manipulateInfo();
                    };
                    function removeConfirm(filterPrefmodel){
                        gridFilteringService.removeUserPreferences(filterPrefmodel).then(function (resp){
                            $scope.message = '';
                            createAndSetEntityModelToScope(resp.info);
                            var activeOption =  _.filter($scope.filterableViewData, {name: $scope.activePreference.identifier});
                            if(activeOption.length== 0){
                                $scope.clearGridFilters();
                            }
                            else{
                                filterModel.setActivePreference(activeOption[0]);
                            }
                        }, showError);
                    }
                    function removeUserPreferences(filterPrefmodel) {
                        popupService.showDeletePermissionPopup({ isConfirm: removeConfirm, data: filterPrefmodel, message: "Are you sure you want to delete this filter?" });
                    };

                    function applyFilterToParentScope(_filterPrefmodel){
                      var  _finalFilter = _filterPrefmodel.filerToApply(_filterPrefmodel.modelToPost);
                        $scope.$evalAsync($scope.callbackFilter()(_finalFilter));
                    };

                    $scope.$on("$destroy", $scope.$watch('options', function (newVal, oldVal) {
                            if(undefined !== newVal && newVal && newVal != oldVal) {
                                $scope.filterPlugin = {
                                    columns: newVal.columns,
                                    //filterPreferences: newVal.filterPreferences,
                                    operators:[
                                        {field:'eq', title:'Is equal to'},
                                        {field:'neq', title:'Is not equal to'},
                                        {field:'startswith', title:'Starts with'},
                                        {field:'contains', title:'Contains'},
                                        {field:'doesnotcontain', title:'Does not contain'},
                                        {field:'endswith', title:'Ends with'},
                                    ]
                                };

                                //Initialize Filter Plugin
                                var _scopedData = {
                                    context: $scope.context,
                                    identifier: $scope.identifier,
                                    key: $scope.key
                                };
                                init();
                                filterModel.setScopeInfoIntoModel(_scopedData); //Set scoped info into model once so that we could utilize this model
                                var _configModel = filterModel.getScopeInfoFromModel();
                                getUserPrefs(_configModel);
                            }
                        }, true));
                }
            }
        }]);
        var OldTextboxvalue;
        app.register.factory('filterPluginModel', ['authenticationFactory', function (authenticationFactory) {
            function performManupulation(info, updateIndex){
                this.applyFilter = function() {
                   var _activePrefs = _defaultModel.viewData.activePreference;
                    _activePrefs.identifier = this.name;
                    _activePrefs.highlightedIndex = this.index;
                    var _filterModel = createGridFilters(this);
                    if(_defaultModel &&
                        _defaultModel.customOps &&
                        typeof _defaultModel.customOps.applyCallbackFunc === 'function')
                    {
                        _defaultModel.customOps.applyCallbackFunc(_filterModel);
                    }
                };

                this.edit = function () {

                    var formSettings = _form.form;
                    formSettings.showForm=!formSettings.showForm;
                    formSettings.identifier = this.name;
                    formSettings.enabled  = false;
                    formSettings.record = this.data;
                    formSettings.isDuplicate = this.data.length > 0 && this.data[0].operator === 'DUPLICATE';
                    OldTextboxvalue = this.data[0].value;
                    _form.manupulateFormModel();
                };
                this.delete = function (){
                    var _extendScopedmodel = angular.extend({}, _defaultModel.scopedInfo);
                    _extendScopedmodel.identifier = this.name;

                    if(_defaultModel &&
                        _defaultModel.customOps &&
                        _defaultModel.customOps.deletePrefs &&
                       typeof _defaultModel.customOps.deletePrefs.callbackFunc === 'function')
                    {
                        _defaultModel.customOps.deletePrefs.callbackFunc(_extendScopedmodel);
                    }
                };

                var _commonFun = {
                    edit : this.edit,
                    delete : this.delete,
                    applyFilter : this.applyFilter
                }
                if(!isNaN(updateIndex)){
                    var _modifiedData = [];
                    angular.forEach(info.data, function(item, index){
                        _modifiedData.push(angular.extend({}, item, _info));
                    });
                    this.viewData.info[updateIndex].data =  _modifiedData;
                    return;
                }

                if(info && info.name && info.data && info.data.length>0){
                    info = angular.extend({}, _commonFun, info);
                    /*info.edit = this.edit;
                    info.delete = this.delete;
                    info.applyFilter = this.applyFilter;*/
                    info.index = this.viewData.info.length;
                    this.viewData.info.push(info);
                }else {
                    var infoData = this.getData();
                    this.viewData.info = [];
                    for (var i = 0; i < infoData.length; i++) {
                        infoData[i] = angular.extend({}, _commonFun, infoData[i]);
                        /*infoData[i].edit = this.edit;
                        infoData[i].delete = this.delete;
                        infoData[i].applyFilter = this.applyFilter;*/
                        infoData[i].index = i;
                        this.viewData.info.push(infoData[i]);
                    }
                }
            }

            var _defaultModel = {
                data:[],
                customOps:{},
                scopedInfo:{
                    context: '',
                    identifier: '',
                    key: '',
                    createdBy: ''
                },
                viewData:{
                    activePreference:{ identifier:'No Filter', highlightedIndex:-1 },
                    info:[]
                },
                initializeDefaultModel: function(){
                    this.data = [];
                    this.customOps = {};
                    this.scopedInfo = {
                        context: '',
                        identifier: '',
                        key: '',
                        createdBy: ''
                    };
                    this.viewData = {
                        activePreference:{ identifier:'No Filter', highlightedIndex:-1 },
                        info:[]
                    };
                },
                setdefaultPreference : function(){
                    this.viewData.activePreference.identifier ='No Filter';
                    this.viewData.activePreference.highlightedIndex = -1;
                },
                setActivePreference: function(prefInfo){
                    this.viewData.activePreference.identifier = prefInfo.name;
                    this.viewData.activePreference.highlightedIndex = prefInfo.index;
                },
                setDataAndCreateFilterModel:function(info){
                    this.viewData.info = [];
                    this.data = info;
                    this.createFilterModel();
                    return this.viewData;
                },
                setData : function(info){
                    this.data = info
                },
                getData : function(){
                    return angular.copy(this.data);
                },
                pushData : function(model){
                    this.data.push(model);
                    this.createFilterModel(model);
                    this.viewData.activePreference.identifier = model.name;
                    this.viewData.activePreference.highlightedIndex = this.viewData.info.length-1;
                    return this.viewData;
                },
                updateData: function(model){
                    var _index;
                    angular.forEach(this.data, function(item, index){
                       if(item.name == model.name){
                           item.data = model.data;
                           _index = index;
                       }
                    });
                    this.createFilterModel(model, _index);
                    this.viewData.activePreference.identifier = model.name;
                    this.viewData.activePreference.highlightedIndex = _index;
                    return this.viewData;
                },
                getDataToFilter: function(){
                    return modelToPost;
                },
                getScopeInfoFromModel : function(){
                    return angular.copy(this.scopedInfo);
                },
                setScopeInfoIntoModel : function(info){
                    this.scopedInfo = {
                        context: info.context,
                        identifier: info.identifier,
                        key: info.key,
                        createdBy: authenticationFactory.getUserName()
                    };
                },
                createFilterModel : performManupulation,
                setConfigurations: function(performOperations){
                  this.customOps = performOperations;
                },
            };

            function remove(){
                var _data = _form.form.viewData;
                //var _record = _form.form.record;
                if (_data.length == 1) {
                    this.logic = '';
                    this.value = '';
                }
                else if (_data.length > 1) {
                    if((0 != this.index) && (_data.length-1) == this.index) {
                        _data[this.index-1].logic = '';
                    }
                    _data.splice(this.index, 1);
                }
                _form.rebuildIndex();//Re-build index after deleting

            };

            function add(logic){
                this.logic = logic;
                var _viewData = _form.form.viewData;
                if((_viewData.length-1) == this.index) {
                    var _defaultOptions = _form.getDefaultModel();
                    var _viewInfo = angular.extend({}, _defaultOptions, _info);
                    _viewInfo.index = _viewData.length;
                    _viewData.push(_viewInfo);
                }
            };

            var _info = { removeOption:remove, addOption: add };

            function manupulateFormModel() {

                _form.form.viewData = [];
                var _formData = _form.getFormData();
                for(var i=0; i<_formData.length; i++){
                    _formData[i] = angular.extend({}, _formData[i], _info);
                    _formData[i].index = i;
                    _form.form.viewData.push(_formData[i]);
                }

                //PATCH
                _form.form.viewData[i-1].logic = "";
            }

            function createGridFilters(filterForm){
                var _finalFilter = { logic: "or", filters:[] };
                var _andLogicFilter = { logic: "and", filters: [] };
                var _lastItem = [];
                var lastOperation = '';
                var filterFormData = angular.extend({}, filterForm.data);
                angular.forEach(filterFormData, function(item, index){
                    if((lastOperation == "and" && item.logic=="and") || (lastOperation=='' && item.logic=="and")){
                        _lastItem.push(item);
                    } else if((lastOperation == "or" && item.logic=="or") || (lastOperation=='' && item.logic=="or") ){
                        _finalFilter.filters.push(item);
                    } else if ((lastOperation == "and" && item.logic=="or") || (lastOperation=='' && item.logic=="or")){
                        _lastItem.push(item);
                    }else if ((lastOperation == "or" && item.logic=="and") || (lastOperation=='' && item.logic=="and")){
                        _lastItem.push(item);
                    } else if (item.logic =="" && lastOperation == "and"){
                        _lastItem.push(item);
                    } else {
                        _finalFilter.filters.push(item);
                    }
                    lastOperation = item.logic;
                });
                _andLogicFilter.filters =_lastItem;

                var _returnFilter = {};
                if(_andLogicFilter.filters.length>0){
                    _finalFilter.filters.push(_andLogicFilter);
                    _returnFilter = _finalFilter;
                } else{
                    _returnFilter = _finalFilter;
                }

                return _returnFilter;
            }

            var _form = {
                form: {
                    identifier:'',
                    showForm: false,
                    isDuplicate: false,
                    enabled:true,
                    record: [],
                    viewData:[]
                },
                modelToPost:[],
                customOps:{},
                getFormData:function(){
                    return this.form.record;
                },
                putFormData:function(data){
                    this.form.record.push(data);
                },
                getDefaultModel : function(){
                    return {field:'', operator:'', value:'', logic:''};
                },
                createForm : function() {
                    this.form.showForm = true;
                    this.form.identifier = '';
                    this.form.enabled = true;
                    this.form.record = [];
                    this.form.isDuplicate = false;
                    this.form.record.push(this.getDefaultModel());
                    this.manupulateFormModel();
                },
                create : function() {
                    var modelToPost = [];
                    var isDupeCheck = this.form.isDuplicate;
                    angular.forEach(this.form.viewData, function(item, index){
                         var _operator = isDupeCheck ? 'DUPLICATE': item.operator;
                         var _item = { field: item.field, operator: _operator, value:item.value, logic:item.logic, index:index};
                         modelToPost.push(_item);
                    });
                    var _submitFormModel = {identifier: this.form.identifier, data: modelToPost};
                    if(_form &&
                        _form.customOps &&
                        _form.customOps.createPrefs &&
                        typeof _form.customOps.createPrefs.callbackFunc === 'function')
                    {
                        this.modelToPost = angular.extend({}, _defaultModel.scopedInfo ,_submitFormModel);

                        var wrappedResp = {
                            modelToPost: this.modelToPost,
                            filerToApply:createGridFilters
                        };

                        _form.customOps.createPrefs.callbackFunc(wrappedResp);
                    }
                },
                preview : function() {
                    var modelToPost = [];
                    var isDupeCheck = this.form.isDuplicate;
                    angular.forEach(this.form.viewData, function(item, index){
                        var _operator = isDupeCheck ? 'DUPLICATE': item.operator;
                        var _item = { field: item.field, operator: _operator, value:item.value, logic:item.logic, index:index};
                        modelToPost.push(_item);
                    });
                    var _submitFormModel = {identifier: this.form.identifier, data: modelToPost};
                    if(_form &&
                        _form.customOps &&
                        _form.customOps.createPrefs &&
                        typeof _form.customOps.createPrefs.callbackFunc === 'function')
                    {
                        this.modelToPost = angular.extend({}, _defaultModel.scopedInfo ,_submitFormModel);

                        var wrappedResp = {
                            modelToPost: this.modelToPost,
                            filerToApply:createGridFilters
                        };
                        _form.customOps.applyPrefs.callbackFunc(wrappedResp);
                    }
                },
                rebuildIndex: function(){
                    angular.forEach(this.form.viewData, function(item, index){
                        item.index = index;
                    });
                },
                validateForm: function validateForm(){
                    var _resp =
                    {
                        isValid:true,
                        message:'identifierAlreadyExist'
                    };
                    var _info = _defaultModel.viewData.info;
                    var _identifier = this.form.identifier.trim();
                    angular.forEach(_info, function(item){
                        if(_identifier == item.name.trim()){
                            _resp.isValid = false;
                        };
                    });
                    return _resp.isValid;
                },

                close:function(){

                    this.form.showForm = false;
                    var CurrenttextboxValue = this.form.viewData[0].value;
                    if (OldTextboxvalue != CurrenttextboxValue)
                        this.form.viewData[0].value = OldTextboxvalue;

                    var activeOption =  _.filter(_defaultModel.viewData.info, {name: _defaultModel.viewData.activePreference.identifier});
                    if(activeOption.length === 0){
                        // Clear grid filter as no preference set yet
                        var modelToPost = [];
                        var _submitFormModel = {identifier: '', data: modelToPost};
                        if(_form &&
                            _form.customOps &&
                            _form.customOps.createPrefs &&
                            typeof _form.customOps.createPrefs.callbackFunc === 'function')
                        {
                            this.modelToPost = angular.extend({}, _defaultModel.scopedInfo ,_submitFormModel);

                            var wrappedResp = {
                                modelToPost: this.modelToPost,
                                filerToApply:createGridFilters
                            }
                            _form.customOps.applyPrefs.callbackFunc(wrappedResp);
                        }
                    }
                    else{
                        this.preview();
                    }
                },

                update : function() {
                    var modelToPost = [];
                    var isDupeCheck = this.form.isDuplicate;
                    angular.forEach(this.form.viewData, function(item, index){
                        var _operator = isDupeCheck ? 'DUPLICATE': item.operator;
                        var _item = { field: item.field, operator: _operator, value:item.value, logic:item.logic, index:index};
                        modelToPost.push(_item);
                    });
                    var _submitFormModel = {identifier: this.form.identifier, data: modelToPost};
                    if(_form &&
                        _form.customOps &&
                        _form.customOps.updatePrefs &&
                        typeof _form.customOps.updatePrefs.callbackFunc === 'function')
                    {
                        this.modelToPost = angular.extend({}, _defaultModel.scopedInfo ,_submitFormModel);

                        var wrappedResp = {
                            modelToPost: this.modelToPost,
                            filerToApply:createGridFilters
                        };

                        _form.customOps.updatePrefs.callbackFunc(wrappedResp);
                    }
                },
                setConfigurations: function(performFormOperations){
                    this.customOps = performFormOperations;
                },
                manupulateFormModel : manupulateFormModel
            }
            return {
                configurations:_defaultModel,
                formConfigurations:_form
            };
        }]);

        app.register.factory('gridFilteringService', ['prefServiceUtil', 'configUrl', function (ajaxService, configUrl) {
                var _service = {};
                var _baseUrl = configUrl.secureUrl + 'site';
                _service.getUserPreferences = function (model) {
                    var request = {
                        method: 'GET',
                        url: "userPref",
                        params: model
                    };
                    return ajaxService.httpGet(request);
                };

                _service.addUserPreferences = function (model) {
                    var request = {
                        method: 'POST',
                        url: configUrl.secureUrl+'preference/save',
                        data: model
                    };
                    return ajaxService.httpSimulatePost(request);
                };

                _service.updateUserPreferences = function (model) {
                    var request = {
                        method: 'POST',
                        url: configUrl.secureUrl+'preference/save',
                        data: model
                    };
                    return ajaxService.httpSimulatePost(request);
                }
                _service.removeUserPreferences = function (model) {
                    var request = {
                        method: 'GET',
                        url: configUrl.secureUrl+'preference/remove',
                        params: model
                    };
                    return ajaxService.httpSimulateGet(request);
                }
                return _service;
            }]);
        app.register.service('prefServiceUtil', ['$http', 'configUrl', '$q',
            function ($http, configUrl, $q) {
                var loadingEnum = {
                    get:'get',
                    post:'post'
                };

                var _decide = {
                    get:{id: '#groupable-filter-menu>.dropdown-menu', class:'filterLoader'},
                    post:{id: '#groupable-filter-menu>form.filter-rules>div:first-child', class:'advance-filter-loading' }
                };

               function loadUi(options){
                   var uiOption = _decide[options];
                   var _default = {};
                   _default.start = function () {
                        $(uiOption.id).addClass(uiOption.class);
                    };
                   _default.stop = function () {
                        $(uiOption.id).removeClass(uiOption.class);
                    }
                   return _default;
                }

                this.httpGet = function (request, route, successFunction, errorFunction) {
                    request.url = configUrl.baseServiceUrl + request.url;
                    request.cache = false;
                    var deferred =  $q.defer();
                    var loadingUi = loadUi(loadingEnum.get);
                    loadingUi.start(); // Show Loader
                    $http(request).success(function (response) {
                        loadingUi.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingUi.stop(); //hide loader
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                };
                this.httpPost = function (request, successFunction, errorFunction) {
                    request.url = configUrl.baseServiceUrl + request.url;
                    var loadingUi = loadUi(loadingEnum.post);
                    loadingUi.start(); // Show Loader
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingUi.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingUi.stop(); //hide loader
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                };
                this.httpSimulatePost = function (request, successFunction, errorFunction) {
                    var loadingUi = loadUi(loadingEnum.post);
                    loadingUi.start(); // Show Loader  var deferred = $q.defer();
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingUi.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingUi.stop(); //hide loader
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                }
                this.httpSimulateGet = function (request, route, successFunction, errorFunction) {
                    request.cache = false;
                    request.params = request.params?request.params:{};
                    request.params['time'] = Date.now();
                    var loadingUi = loadUi(loadingEnum.post);
                    loadingUi.start(); // Show Loader  var deferred = $q.defer();
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingUi.stop(); //hide loader
                        if (response.isSuccess) {
                            deferred.resolve(response);
                        } else {
                            //notifyService.notifyInfo(response);
                            deferred.resolve(response);
                        }
                    }).error(function (xhr, status, error, exception) {
                        loadingUi.stop(); //hide loader
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                }

            }]);
    });
})();