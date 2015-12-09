(function () {
    "use strict";
    define(['assetIt', 'lobs-service', 'lobs-config', 'filter-options', 'kendo-plugin', 'FeedbackTicket'], function (app) {
        app.register.controller('lobsController', ['$scope', '$compile', 'lobsServices', '$routeParams', '$location', 'configUrl', 'lobsConfig', 'popupService',
            function ($scope, $compile, lobsServices, $routeParams, $location, configUrl, lobsConfig, popupService) {
                var lobNameRegexToMakeId = /[^a-zA-Z0-9]/g;
                $scope.initializeController = function () {
                    var prevStage;
                    var _appConfigs = lobsConfig.getConfigs();
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
                                    var _gridData = detailRow.find(".appList").kendoGrid(lobsConfig.getSubGridConfigs());
                                    var req = { "name": e.data.LOB_NAME };
                                    lobsServices.getAppListByLOBName(req).then(function (respData) {
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
                        initialLobName = e.model.LOB_NAME;
                        initialDescription = e.model.DESCRIPTION;
                    };
                    var initialLobName = "";
                    var initialDescription = "";
                    $scope.config.save = function (e) {
                        
                        var request = {
                            "name": e.model.LOB_NAME,
                            "description": e.model.DESCRIPTION
                        };

                        popupService.showDeletePermissionPopup({ isConfirm: updateConfirm, data: request, message: "Are you sure you want to update ?", cancelUpdate: resetChanges })

                        function updateConfirm(request) {
                            lobsServices.editLobs(request).then(function (resp) {

                            }, function (error) {
                                e.model.set('DESCRIPTION', prevStage.DESCRIPTION);
                            });
                        }


                        function resetChanges() {


                            // If user click No during update then Value reset to Original values.
                            var rowId = _.find($('#grid').data('kendoGrid').dataSource.data(), { uid: e.model.uid });

                            rowId.LOB_NAME = initialLobName;
                            rowId.DESCRIPTION = initialDescription;
                          

                            $('#grid').data('kendoGrid').refresh();

                        }
                    };
                    lobsServices.getLobs().then(function (data) {
                        lobsServices.getAllLOBFeedbackCount().then(
                            function (feedbackResp) {
                                var _feedbackCountObj = _.object(_.pluck(feedbackResp, 'ID'), feedbackResp);
                                _.each(data, function (litem) {
                                    var _cnt = _feedbackCountObj[litem.LOB_NAME];
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

                    if ($routeParams.name) {
                        $scope.filteredState = true;
                        $scope.config.pageable = false;
                        $scope.config.dataSource.filter = _appConfigs.routeParamFilter($routeParams.name);
                    }
                };

                $scope.updateFeedbackCount = function (lobName, count) {
                    angular.forEach($('#grid').data().kendoGrid.dataSource.data(), function (lob) {
                        if (lob.LOB_NAME == lobName) {
                            lob.COUNT = count;
                        }
                    });
                    var countElements = $(".feedbackCount" + lobName.replace(lobNameRegexToMakeId, "_"));
                    countElements.html(count);
                    countElements.parent().removeClass("hide");
                };

                $scope.filterGridRecord = function (text) {
                    var _appConfigs = lobsConfig.getConfigs();
                    $scope.filterGrid(text, _appConfigs.getDefaultFilterWithFilterText(text));
                }
            }]);
    });
})();