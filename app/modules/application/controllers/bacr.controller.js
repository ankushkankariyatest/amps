/**
 * Created by wizdev on 7/1/2015.
 */
(function ($, angular) {
    "use strict";
    define(['assetIt', 'app-config','kendo-plugin', 'app-infra-tab', 'applicationService', 'ticket-service'], function (app) {
        app.register.controller('bacrController', ['$scope', '$rootScope','$location','appConfig', 'authenticationFactory', 'applicationService', "FeedbackTicketService", "popupService",function ($scope, $rootScope, $location,appConfig, authenticationFactory, applicationService, FeedbackTicketService, popupService) {
            $scope.initController = function () {
                var bacrConfig = appConfig.getBacrConfigs();
                $scope.bacrConfig = bacrConfig;
                $scope.appData = appConfig.getApplication();
                $scope.comment = (!$scope.appData.comment && $scope.appData.oldData)?"No Comments found":$scope.appData.comment;
                $scope.obj ={comment : $scope.comment==undefined?"":$scope.comment};
                $scope.showInfrastructure = authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.enterprise) > -1;
                $rootScope.certifyStatus  = {
                };
                $scope.totalCount=250;
                $scope.remainingCount=250;
            };
            $scope.updateCount = function() {
                $scope.remainingCount = $scope.obj.comment.length >= $scope.totalCount ? 0 : $scope.totalCount - $scope.obj.comment.length;
                $scope.obj.comment = $scope.obj.comment.substring(0, $scope.totalCount);
            };
            $scope.certify = function() {
                $rootScope.status  = !($scope.obj.certify);
                var lanID = authenticationFactory.lanid;
                var appOwner  =$scope.getLanfromValue($scope.appData.CLIENT_OWNER);
                var appITlead  =$scope.getLanfromValue($scope.appData.IT_LEAD);
                var role = appOwner==lanID?"Client Owner":"other";
                role = appITlead==lanID?"IT Lead":role;
                var appModal = {
                    recordData: appConfig.getApplication(),
                    createdBy: authenticationFactory.user,
                    context: 'APPLICATION',
                    identifier: $scope.appData.APP_ID,
                    comment: $scope.obj.comment,
                    role : role,
                    status: $rootScope.status
                };
                applicationService.certifyApplication(appModal).then(function(resp){
                    $rootScope.certifyStatus  = resp;
                    popupService.showCertifySuccess();
                }, function() {
                    popupService.showCertifyError();
                });
                if(status==='0') {
                    var ticketModel  = {
                        "context": 'APPLICATION',
                        "id": $scope.appData.APP_ID,
                        "page": $location.absUrl(),
                        "mood": 'happy',
                        "message": $scope.obj.comment,
                        "status": 'submitted'
                    };
                    FeedbackTicketService.post(ticketModel);
                }
            };
            $scope.getLanfromValue = function(str) {
                if(null != str && undefined !== str && 'undefined'!=str)
                {
                    return str.substring(str.lastIndexOf("(") + 1, str.lastIndexOf(")"));
                }
                return '';
            }

            $scope.exportPageToPDf = function(){
                $('.notForPdf').hide();
                kendo.drawing.drawDOM($("#bacrView"))
                    .then(function(group) {
                        // Render the result as a PDF file
                        return kendo.drawing.exportPDF(group, {
                            paperSize: "auto",
                            margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                        });
                    })
                    .done(function(data) {
                        // Save the PDF file
                        kendo.saveAs({
                            dataURI: data,
                            fileName: "AM4IT-Business-Application-Configuration-Report.pdf",
                            proxyURL: "#/"
                        });
                        $('.notForPdf').show();
                    });
            }
        }]);

        app.register.controller('appSystemInfoController', ['$scope', '$rootScope', 'messageInfo', '$location', '$compile', 'authenticationFactory', 'infraInfoModel', 'popupService',
            function ($scope, $rootScope, messageInfo, $location, $compile, authenticationFactory, infraInfoModel, popupService) {

                function initTabStrip() {
                    var _tabStrip = $("#kendoTabstrip").kendoTabStrip({
                        animation: {
                            open: {effects: "fadeIn"}
                        },
                        contentUrls: [
                            'app/modules/application/templates/appInfo/app-system-info-grid.html',
                            'app/modules/application/templates/appInfo/app-system-info-grid.html'
                        ],
                        contentLoad: function (e) {
                            $scope.infraType = e.item.innerText;
                            $compile(e.contentElement)($scope);
                        },
                        select: function (e) {
                            $scope.infraType = e.item.innerText;
                            $compile(e.contentElement)($scope);
                        }
                    }).data("kendoTabStrip");
                    _tabStrip.select(0);
                };

                //initTabStrip();
                var _ticketModel  = {
                    "context": 'APP-OnBoarding',
                    "id": $scope.appId,
                    "page": $location.absUrl(),
                    "mood": 'New Infra',
                    "message": '',
                    "status": 'submitted'
                };

                var _onboardingModel  = {
                    id: $scope.appId,
                    context:'APP-OnBoarding',
                    email:authenticationFactory.user,
                    data:'',
                    status:'submitted'
                };

                $scope.initCtrl = function(){
                    infraInfoModel.clearData();
                    $rootScope.showOnboard = false;
                };

                $rootScope.verifyOnboardData = function() {
                    var _data ={ onboardingDetails: infraInfoModel.getData()};
                    popupService.showOnboardingPopup('app/modules/application/templates/appInfo/onboarding-details.html', _data);
                };
                $rootScope.postOnboardData = function() {
                    var _data =JSON.stringify({ onboardingDetails: infraInfoModel.getData()});
                    _ticketModel.message = _data;
                    _onboardingModel.data = _data;
                    messageInfo.insertOnboardingInfo(_onboardingModel);
                    messageInfo.postTicket(_ticketModel);
                    infraInfoModel.clearData();
                    $rootScope.showOnboard = false;
                };
        }]);
        app.register.factory('infraInfoModel', function () {
                var _model = {};
                _model.infra = {};
                _model.getData = function(model){
                   return this.infra;
                };
                _model.clearData = function () {
                    this.infra = {};
                };
                _model.setData = function(model){
                    this.infra = model;
                };

                _model.addData = function(model){
                    var _obj = {
                        Request_ID: model.Request_ID,//
                        BEDatasetId: model.BEDatasetId,
                        BEReconciliationIdentity: model.BEReconciliationIdentity,
                        BEName: model.BEName,
                        RELDatasetId: model.RELDatasetId,
                        RELSourceReconciliationIdentity: model.RELSourceReconciliationIdentity,
                        RELName: model.RELName,//
                        RELSource: model.RELSource,//
                        BEInstanceId: model.BEInstanceId,
                        BDAssetClass: model.BDAssetClass,//
                        BEAssetID: model.BEAssetID,//
                        BEClassId: model.BEClassId,
                        BEDescription: model.BEDescription,
                        BESerialNumber: model.BESerialNumber,
                        BEShortDescription: model.BEShortDescription,
                        RELAsset_Class_Id: model.RELAsset_Class_Id,
                        RELAsset_Instance_ID: model.RELAsset_Instance_ID,
                        RELAssetReconciliationIdentity: model.RELAssetReconciliationIdentity,
                        RELClass_Id: model.RELClass_Id,
                        RELInstance_Id: model.RELInstance_Id,
                        RELModel: model.RELModel,//
                        RELRelationshipName: model.RELRelationshipName,
                        RELUser_Display_Object_Name: model.RELUser_Display_Object_Name,//
                        RELVersionNumber: model.RELVersionNumber//
                    };

                    var _key = model.uid;
                    this.infra[_key] = _obj;
                };
                return _model;
            });

        app.register.factory('messageInfo', ['FeedbackTicketService','appInfraService','$timeout',
            function (FeedbackTicketService, appInfraService, $timeout) {
                var _service = {};
                _service.insertOnboardingInfo = function(model){
                    appInfraService.insertOnboardingInfo(model).then(function(data){
                        var _isa_success =  $('.isa_success');
                        _isa_success.css('display', 'block');

                        var _ticketInfo =  $('#successInfo');
                        _ticketInfo.html('Successfully generated a ticket for this Request');
                        $timeout( function(){
                            _isa_success.css('display', 'none');
                            _ticketInfo.html('');
                        }, 3000);

                    },function(error){
                        var _isa_error =  $('.isa_error');
                        _isa_error.css('display', 'block');

                        var _ticketInfo = $('#errorInfo');
                        _ticketInfo.html('Not able to submit ticket for this request. Please try later');
                        $timeout( function(){
                            _isa_error.css('display', 'none');
                            _ticketInfo.html('');
                        }, 3000);
                    });
                },
                _service.postTicket = function (ticketModel) {
                    FeedbackTicketService.post(ticketModel).then(function(data){
                     var _isa_success =  $('.isa_success');
                     _isa_success.css('display', 'block');

                     var _ticketInfo =  $('#successInfo');
                     _ticketInfo.html('Successfully generated a ticket for this Request');
                     $timeout( function(){
                     _isa_success.css('display', 'none');
                     _ticketInfo.html('');
                     }, 3000);

                     },function(error){
                     var _isa_error =  $('.isa_error');
                     _isa_error.css('display', 'block');

                     var _ticketInfo = $('#errorInfo');
                     _ticketInfo.html('Not able to submit ticket for this request. Please try later');
                     $timeout( function(){
                     _isa_error.css('display', 'none');
                     _ticketInfo.html('');
                     }, 3000);
                     });
                };
                return _service;
            }]);

        app.register.directive('crudKendoGrid',['$rootScope', 'appInfraService', 'messageInfo', '$location','$timeout', 'infraInfoModel',
            function ($rootScope, appInfraService, messageInfo, $location, $timeout, infraInfoModel) {
                return {
                restrict: "AE",
                scope:{
                    key:'@',
                    type:'@'
                },
                link: function ($scope, element, attr) {
                    var ticketModel  = {
                        "context": 'APP-OnBoarding',
                        "id": $scope.key,
                        "page": $location.absUrl(),
                        "mood": 'Correct',
                        "message": '',
                        "status": 'submitted'
                    };

                    function postTicket(){
                        messageInfo.postTicket(ticketModel);
                    };

                    function createModelData(modelInfo){
                        var _obj = {
                            Request_ID: '',
                            BEDatasetId: '',
                            BEReconciliationIdentity:'',
                            BEName:'',
                            RELDatasetId:'',
                            RELSourceReconciliationIdentity:'',
                            RELName: '',
                            BEInstanceId:'',
                            BDAssetClass:'',
                            BEAssetID:'',
                            BEClassId:'',
                            BEDescription:'',
                            BESerialNumber:'',
                            BEShortDescription:'',
                            RELAsset_Class_Id:'',
                            RELAsset_Instance_ID:'',
                            RELAssetReconciliationIdentity:'',
                            RELClass_Id:'',
                            RELInstance_Id:'',
                            RELModel: '',
                            RELRelationshipName:'',
                            RELUser_Display_Object_Name: '',
                            RELVersionNumber: ''
                        };

                        angular.extend({}, _obj, modelInfo);
                        console.log(_obj);
                    }

                    element.kendoGrid({
                        dataSource: new kendo.data.DataSource({
                            pageSize: 20,
                            schema: {
                                model: {
                                    id: 'Request_ID',
                                    fields: {
                                        "BEAssetID": { type: "string", validation: { required: true }  },
                                        "BDAssetClass": { type: "string" , validation: { required: true } },
                                        "RELUser_Display_Object_Name": { type: "string" , validation: { required: true } },
                                        "RELName": { type: "string" , validation: { required: true } },
                                        "RELModel": { type: "string", validation: { required: true } },
                                        "RELVersionNumber": { type: "string" , validation: { required: true }},
                                        "RELSource": { type: "string", validation: { required: true } }
                                    }
                                }
                            },
                            data: []
                        }),
                        allowCopy: true,
                        batch:true,
                        autoBind: true,
                        scrollable: true,
                        groupable: false,
                        selectable: false,
                        resizable: true,
                        height: 400,
                        filterable: false,
                        pageable: {
                            refresh: false,
                            input: true,
                            numeric: false,
                            pageSize: 20,
                            pageSizes: [20, 50, 100, 200]
                        },
                        editable: 'inline',
                        toolbar: ["create"],//, "cancel", "save"
                        columns: [
                                { field: "BDAssetClass", title: "Asset" },
                                { field: "RELUser_Display_Object_Name", title: "Asset Object" },
                                { field: "RELName", title: "Name" },
                                { field: "RELModel", title: "Model" },
                                { field: "RELVersionNumber", title: "OS Version" },
                                { command: [
                                    {name: "edit"}
                                    /*{name: "Delete",
                                        text: "Remove",
                                        click: function(e){  //add a click event listener on the delete button
                                            e.stopPropagation();
                                            var tr = $(e.target).closest("tr"); //get the row for deletion
                                            var data = this.dataItem(tr); //get the row data so it can be referred later

                                           /!* $("#yesButton").click(function(){
                                                var _data = createModelData(data);
                                                ticketModel.message = JSON.stringify(_data);
                                                postTicket();
                                                window.close();
                                            });

                                            $("#noButton").click(function(){ window.close(); })*!/
                                        }
                                    }*/
                                ]}
                            ],
                        save: function(e) {
                            $rootScope.showOnboard = true;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                            infraInfoModel.addData(e.model);
                            /*postTicket();*/
                        },
                        update: function(e) {
                            return true;
                        }
                    }).data("kendoGrid");

                    var infraType = {
                        'General': {callSvc: createInfraEnvironmentView},
                        'Reported Ticket': {callSvc: getInfraPendingApprovalView}
                    };

                    function createInfraEnvironmentView(){
                        appInfraService.createInfraEnvironmentView($scope.key).then(function (resp) {
                            if (resp.isSuccess) {
                                var _data = [];
                                $.each(resp.response, function (key, value){
                                    var _junkString = "RELSource.ReconciliationIdentity";
                                    if(value[_junkString] !== undefined) {
                                        value.RELSourceReconciliationIdentity = value[_junkString];
                                        delete value[_junkString];
                                    }
                                    _data.push(value);
                                });
                                element.data("kendoGrid").dataSource.data(_data);
                            }
                        });
                    }

                    function getInfraPendingApprovalView(){
                        appInfraService.getInfraPendingApprovalView($scope.key).then(function (resp) {
                            var _data = [];
                            if(resp.response && resp.response.length>0) {
                                $.each(resp.response, function (key, value) {
                                    var _dataInfra = $.parseJSON(value.DATA);
                                    _data.push(_dataInfra);
                                });
                            };
                            infraInfoModel.setData(_data);
                            element.data("kendoGrid").dataSource.data(_data);
                        });
                    }


                    var activeInfra = infraType[$scope.type];
                    activeInfra.callSvc();
                }
            };
        }]);
    });
})($, angular);