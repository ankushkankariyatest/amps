(function () {
    "use strict";
    define(['assetIt', 'kendo.all.min', 'userService', 'export-util'], function (app) {

        app.register.controller('userController', ['$scope', '$rootScope', 'userService', 'exportUtil', 'userRoles','popupService', 'authenticationFactory',
            function ($scope, $rootScope, userService, exportUtil, userRoles, popupService, authenticationFactory) {
                var gridDataSourceOptions = {
                    schema: {
                        model: {
                            id: "username",
                            fields: {
                                username: {type: "string", editable: false},
                                fullName: {type: "string",editable:true},
                                companyName: {
                                    type: "string",
                                    validation: {
                                        notempty: function (input) {
                                            var _decisionMaker = {
                                                fullName: "Name is required",
                                                companyName: "Company name is required"
                                            };
                                            input.attr("data-notempty-msg", _decisionMaker[input.attr("name")]);
                                            return String(input.val()).trim() == '' ? false : true;
                                        }
                                    }
                                },
                                isAdmin: {type: "boolean"},
                                isEnterprise: {type: "boolean"},
                                isNERC_CIP: {type: "boolean", editable: false},
                                status: {type: "boolean"}
                            }
                        }
                    },
                    pageSize: 20
                };
                $scope.exportToExcel = function () {
                    var excelGrid = $("#kendo-users").data("kendoGrid");
                    var dataSource = excelGrid.dataSource;
                    var filters = angular.copy(dataSource.filter());
                    var allData = dataSource.data();
                    var query = new kendo.data.Query(allData);
                    var data = query.filter(filters).data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].isAdmin = data[i].isAdmin ? "Yes" : "No";
                        data[i].isEnterprise = data[i].isEnterprise ? "Yes" : "No";
                        data[i].isNERC_CIP = data[i].isNERC_CIP ? "Yes" : "No";
                        data[i].status = data[i].status ? "Active" : "Inactive";
                    }
                    dataSource.filter({});
                    dataSource.data(data);
                    exportUtil.exportToExcel(excelGrid);
                    var newDataSource = new kendo.data.DataSource(gridDataSourceOptions);
                    newDataSource.filter(filters);
                    excelGrid.setDataSource(newDataSource);
                }

                $scope.exportToCsv = function () {
                    var excelGrid = $("#kendo-users").data("kendoGrid");
                    var dataSource = excelGrid.dataSource;
                    var filters = angular.copy(dataSource.filter());
                    var allData = dataSource.data();
                    var query = new kendo.data.Query(allData);
                    var data = query.filter(filters).data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].isAdmin = data[i].isAdmin ? "Yes" : "No";
                        data[i].isEnterprise = data[i].isEnterprise ? "Yes" : "No";
                        data[i].isNERC_CIP = data[i].isNERC_CIP ? "Yes" : "No";
                        data[i].status = data[i].status ? "Active" : "Inactive";
                    }
                    dataSource.filter({});
                    dataSource.data(data);
                    exportUtil.exportToCsv(excelGrid);
                    var newDataSource = new kendo.data.DataSource(gridDataSourceOptions);
                    newDataSource.filter(filters);
                    excelGrid.setDataSource(newDataSource);
                };

                $scope.initializeController = function () {
                    createGrid();
                    userService.getUserList(createDataSource);
                };
                var createDataSource = function (users) {
                    //var userList = [];
                    angular.forEach(users, function(user, index){
                        user.isAdmin = user.roles.indexOf(userRoles.admin) > -1;
                        user.isNERC_CIP = user.roles.indexOf(userRoles.nercCip) > -1;
                        user.isEnterprise = user.roles.indexOf(userRoles.enterprise) > -1;
                    });
                    gridDataSourceOptions.data = users;
                    var userDataSource = new kendo.data.DataSource(gridDataSourceOptions);
                    $("#kendo-users").data("kendoGrid").setDataSource(userDataSource);
                };
                var createGrid = function () {
                    var expandedRow;
                    var _grid = $("#kendo-users").kendoGrid({
                        sortable: {
                            mode: "single",
                            allowUnsort: true
                        },
                        filterable: {
                            extra: false
                        },
                        columns: [
                            {
                                field: "username",
                                title: "Email Address",
                                width: 50,
                                filterable: false
                            },
                            {
                                field: "fullName",
                                title: "Name",
                                width: 20,
                                filterable: false
                            },
                            {
                                field: "isEnterprise",
                                title: "Enterprise Features",
                                width: 25,
                                template: function (data) {
                                    return (data.isEnterprise == true) ? "Yes" : "No";
                                },
                                filterable: {
                                    messages: {isTrue: "Yes", isFalse: "No"}
                                }
                            },
                            {
                                field: "isNERC_CIP",
                                title: "BCA Inventory",
                                width: 20,
                                template: function (data) {
                                    return (data.isNERC_CIP == true) ? "Yes" : "No";
                                },
                                filterable: {
                                    messages: {isTrue: "Yes", isFalse: "No"}
                                }
                            },
                            {
                                field: "isAdmin",
                                title: "AMPS Admin",
                                width: 20,
                                template: function (data) {
                                    return (data.isAdmin == true) ? "Yes" : "No";
                                },
                                filterable: {
                                    messages: {isTrue: "Yes", isFalse: "No"}
                                }
                            },
                            {
                                field: "status",
                                title: "Status",
                                width: 50,
                                template: function (data) {
                                    return (data.status == true) ? "Active" : "Inactive";
                                },
                                filterable: {
                                    messages: {isTrue: "Active", isFalse: "Inactive"}
                                }
                            },
                            {
                                title: "Actions",
                                width: 50,
                                command: "edit"
                                //template: '<a class="k-grid-edit" style="cursor:pointer"><i class="glyphicon glyphicon-edit"></i></a>',
                            }
                        ],
                        autoBind: true,
                        scrollable: false,
                        groupable: false,
                        //selectable: true,
                        pageable: {refresh: false, input: true, numeric: false, pageSize: 20, pageSizes: [20, 50, 100, 200]},
                        resizable: true, // to make a column resizable
                        editable: "popup",

                        save: function (e) {

                            popupService.showDeletePermissionPopup({ isConfirm: updateConfirm, data: e, message: "Are you sure you want to update ?", cancelUpdate: resetChanges });
                            function updateConfirm (e) {

                                var isAdmin = e.model.isAdmin;
                                var isNERC_CIP = e.model.isNERC_CIP;
                                var isEnterprise = e.model.isEnterprise;
                                var roles = [];
                                if (isAdmin) {
                                    roles.push(userRoles.admin);
                                }
                                if (isNERC_CIP) {
                                    roles.push(userRoles.nercCip);
                                }
                                if (isEnterprise) {
                                    roles.push(userRoles.enterprise);
                                }
                                e.model.roles = roles;
                                userService.updateUserList(e.model, function(){
                                    // Update Full Name on UI if current user is updated
                                    if(authenticationFactory.getUserName() == e.model.username) {
                                        authenticationFactory.setFullName(e.model.fullName);
                                        $rootScope.fullName = e.model.fullName;
                                    }
                                });
                            }

                            function resetChanges() {


                                // If user click No during update then Value reset to Original values.
                                var rowId = _.find($('#kendo-users').data('kendoGrid').dataSource.data(), { uid: e.model.uid });

                                rowId.isAdmin = isinitialAdmin;
                                rowId.isNERC_CIP = isinitialNERC_CIP;
                                rowId.isEnterprise = isinitialEnterprise;
                                rowId.status = isinitialStatus;
                                rowId.fullName = initialFullName;
                                $('#kendo-users').data('kendoGrid').refresh();

                            }
                        },
                        edit: editTmplFn,
                        dataBound: function () {


                            var q = $("#txtSearchString").val();
                            if (q.length > 0) {
                                $("#kendo-users tbody").highlight(q);
                            }



                        }
                        /*
                        detailInit: function(e) {
                            var detailRow = e.detailRow;
                        },
                        detailExpand: function (e) {
                            if (expandedRow != null && expandedRow[0] != e.masterRow[0]) {
                                element.data("kendoGrid").collapseRow(expandedRow);
                            }
                            expandedRow = e.masterRow;
                            $scope.highlightFn($scope.searchTextData);
                        },
                        detailTemplate: kendo.template($("#appTemplate").html())
                        */
                    }).data("kendoGrid");
                }
                $scope.highlightFn = function (q) {
                    if (q && q.length > 0) {
                        $("#kendo-users tbody tr td").highlight(q);
                        $("#kendo-users tbody tr.k-master-row").highlight(q);
                        $("#kendo-users tbody tr.k-detail-row td").highlight(q);
                        $("#kendo-users tbody tr.k-detail-row .assetIT-main-app_details_block").highlight(q);
                    }
                }
                $("#txtSearchString").bind('input propertychange',function (e) {
                    onSearch();
                    $("#txtSearchString").focus();
                });

                var onSearch = function () {
                    var q = $("#txtSearchString").val();
                    var grid = $("#kendo-users").data("kendoGrid");
                    var pageSize = grid.dataSource.pageSize();
                    var filter = grid.dataSource.filter();
                    var currentFilter = {
                        logic: "or",
                        filters:
                                [
                                    {field: "username", operator: "contains", value: q},
                                    {field: "fullName", operator: "contains", value: q},
                                    {field: "companyName", operator: "contains", value: q}
                                ]
                    }
                    var myFilters = filter ? filter : {filters: [], logic: "and"};
                    for (var i in myFilters.filters) {
                        if (myFilters.filters[i].filters !== undefined) {
                            myFilters.filters.splice(i, 1);
                        }
                    }
                    myFilters.filters.push(currentFilter);
                    grid.dataSource.filter(myFilters);
                    grid.dataSource.pageSize(pageSize);
                    $scope.highlightFn(q);
                }

                var isinitialAdmin = "";
                var isinitialNERC_CIP = "";
                var isinitialEnterprise = "";
                var isinitialStatus = "";
                var initialFullName = "";

                var editTmplFn = function (e) {
                    e.sender.editable.validatable._errorTemplate = kendo.template($('#errormsg-template').html());
                    $('.k-edit-form-container').parents("div.k-window").addClass("k-window-custom");

                  // To fetch initial values of grid
                    isinitialAdmin = e.model.isAdmin;
                    isinitialNERC_CIP = e.model.isNERC_CIP;
                    isinitialEnterprise = e.model.isEnterprise;
                    isinitialStatus = e.model.status;
                    initialFullName = e.model.fullName;
                }



            }
        ]);
    });
})();
