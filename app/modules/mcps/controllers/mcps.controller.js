(function () {
    "use strict";
    define(['assetIt', 'mcps-service', 'mcps-config', 'filter-options', 'kendo-plugin', 'FeedbackTicket'], function (app) {
        app.register.controller('mcpsController', ['$scope', '$compile', 'mcpsServices', '$routeParams', '$location', 'configUrl', 'mcpsConfig','popupService',
        function ($scope, $compile, mcpsServices, $routeParams, $location, configUrl, mcpsConfig,popupService) {
                $scope.initializeController = function () {
                    var prevStage;
                    var _appConfigs = mcpsConfig.getConfigs();
                    $scope.config = _appConfigs;
                    //Detail Expanded view configuration
                    $scope.config.detailTemplate = kendo.template($("#appTemplate").html());
                    $scope.config.detailInit = function (e) {
                        var detailRow = e.detailRow;
                        var tabStrip = detailRow.find(".tabstrip").kendoTabStrip({
                            animation: {
                                open: { effects: "fadeIn" }
                            },
                            select: function (event) {
                                if (event.item.textContent.indexOf('General') > -1) {
                                   var _gridData = detailRow.find(".appList").kendoGrid(mcpsConfig.getSubGridConfigs());
                                    mcpsServices.getAppListByProcess(e.data.CODE).then(function (respData) {
                                        _gridData.data("kendoGrid").dataSource.data(respData);
                                    }, function (error) { console.log('getAppListByProcess service failed..' + error); });
                                }
                                if (event.item.textContent.indexOf('Feedback') > -1) {
                                    $compile(event.contentElement)($scope);
                                }
                            }
                        }).data("kendoTabStrip");

                        tabStrip.select(0);
                    };

                    $scope.config.editable = "popup";
                    $scope.config.edit = function (e) {
                        prevStage = angular.copy(e.model);
                        e.container.find(".k-edit-label:last").hide();
                        e.container.find(".k-edit-field:last").hide();
                        e.sender.editable.validatable._errorTemplate = kendo.template($('#errormsg-template').html());
                        $('.k-edit-form-container').parents("div.k-window").addClass("k-window-custom");

                        // To fetch initial values of grid 
                        initialCode = e.model.CODE;
                        initialDescription = e.model.DESCRIPTION;
                        initialbusinessContact = e.model.BUSINESS_CONTACT;
                        initialbusinessContinuity = e.model.BUSINESS_CONTINUITY;

                    };
                    var initialCode = "";
                    var initialDescription = "";
                    var initialbusinessContact = "";
                    var initialbusinessContinuity = "";
                    $scope.config.save = function (e) {
                        
                        var request = {
                            "code": e.model.CODE,
                            "description": e.model.DESCRIPTION,
                            "contact": e.model.BUSINESS_CONTACT,
                            "continuity": e.model.BUSINESS_CONTINUITY
                        };

                        popupService.showDeletePermissionPopup({ isConfirm: updateConfirm, data: request, message: "Are you sure you want to update ?", cancelUpdate: resetChanges })
                        function updateConfirm (request) { 
                            
                            mcpsServices.editProcess(request).then(function (resp) {

                        }, function (error) {
                            e.model.set('DESCRIPTION', prevStage.DESCRIPTION);
                            e.model.set('BUSINESS_CONTACT', prevStage.BUSINESS_CONTACT);
                            e.model.set('BUSINESS_CONTINUITY', prevStage.BUSINESS_CONTINUITY);
                        });
                        }

                        function resetChanges() {


                            // If user click No during update then Value reset to Original values.
                            var rowId = _.find($('#grid').data('kendoGrid').dataSource.data(), { uid: e.model.uid });

                            rowId.CODE = initialCode;
                            rowId.DESCRIPTION = initialDescription;
                            rowId.BUSINESS_CONTACT = initialbusinessContact;
                            rowId.BUSINESS_CONTINUITY = initialbusinessContinuity;

                            $('#grid').data('kendoGrid').refresh();

                        }

                    };

                    mcpsServices.getMcps().then(function (data) {
                        mcpsServices.getAllMCPFeedbackCount().then(
                            function (feedbackResp) {
                                var _feedbackCountObj = _.object(_.pluck(feedbackResp, 'ID'), feedbackResp);
                                _.each(data, function (litem) {
                                    var _cnt = _feedbackCountObj[litem.CODE];
                                    litem.COUNT = (undefined === _cnt) ? 0 : _cnt.COUNT;
                                });
                                $scope.config.updateGrid(data);
                            },
                            function (error) {
                                $scope.config.updateGrid(data);
                                console.log('mcps feedback Count failed..' + error);
                            }
                            );
                    },
                        function (error) { console.log('mcps service failed..' + error); }
                    );

                    if ($routeParams.code) {
                        $scope.filteredState = true;
                        $scope.config.pageable = false;
                        $scope.config.dataSource.filter = _appConfigs.routeParamFilter($routeParams.code);
                    }
                };
                $scope.updateFeedbackCount = function (mcpCode, count) {
                    angular.forEach($('#grid').data().kendoGrid.dataSource.data(), function (mcp) {
                        if (mcp.CODE == mcpCode) {
                            mcp.COUNT = count;
                        }
                    });
                    var countElements = $(".feedbackCount" + mcpCode);
                    countElements.html(count);
                    countElements.parent().removeClass("hide");
                };
                $scope.filterGridRecord = function (text) {
                    var _appConfigs = mcpsConfig.getConfigs();
                    $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
                }
            }]);
    });
})();