(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.directive('assetItFilterOptions', ['$location', 'environments',
            function ($location, environments) {
                return {
                    restrict: "AE",
                    transclude: true,
                    template: '<div class="pull-right single_record hide" ng-show="filteredState">\
                                <h2>Showing single record of <span>(AppID - 120)</span></h2>\
                                <a class="btn btn-primary" href="#applications"><i class="glyphicon glyphicon-hdd"></i> Show All</a>\
                              </div>\
                                <div class="row">\
                                    <div class="assetIT-page-heading"> <h1><span> {{heading}} </span> </h1></div>\
									<div class="col-md-12 marginT10">\
										<div class="input-group assetIT-main-search_control">\
											<input type="text" class="form-control search_bg" ng-disabled="filteredState" id="txtSearchString" ng-model="searchText" placeholder="{{placeHolderText}}" aria-describedby="search field" tabIndex="-1">\
										</div>\
									</div>\
								</div>\
								<div class="pull-right grid-top-btn">\
									<a class="btn-show-all" ng-click="showAllRecords()" ng-show="filteredState" title="Show All Records"><i class="icon-show-all-record"></i> <span class="hidden-xs">Show All</span></a>\
                                        <a class="btn-excel hidden-xs" ng-show = "!isSafari" ng-click="exportToExcel()" title="Export to Excel"><i class="icon-excel"></i></a>\
                                        <a class="btn-CSV hidden-xs" ng-show = "!isSafari" ng-click="exportToCsv()" title="Export to CSV">CSV</a>\
								</div>\
                                <h5 style="color:red; font-style:italic"><span>{{dataClassification}}</span></h5>',
                    //<a class="btn-CSV hidden-xs" ng-click="exportToPDF()" title="Export to PDF">PDF</a>\
                    scope: {
                        kGridOptions: '=',
                        searchTextData: '=',
                        filterGridRecord: '&',
                        filteredState: '=',
                        exportTo: '&',
                    },
                    link: function ($scope, element, attrs) {
                        var _activeRoute = {
                            'home': { heading: 'Welcome to AMPS', searchPlaceHolderText: 'Search in Home' },
                            'applications': { heading: 'Applications', searchPlaceHolderText: 'Search in Applications', showAll:'/applications' },
                            'mcps': { heading: 'Mission Critical Process', searchPlaceHolderText: 'Search in MCPs', showAll:'/mcps' },
                            'lobs': { heading: 'Line of Business', searchPlaceHolderText: 'Search in LOBs', showAll:'/lobs', dataClassification: "The data on this tab is currently being updated. Please help us improve the quality of the data in AMPS by using the feedback button" },
                            'feedback': { heading: 'Feedbacks', searchPlaceHolderText: 'Search in Feedbacks' },
                            'certifications': { heading: 'Certifications', searchPlaceHolderText: 'Search in Certifications' },
                            'sites': { heading: 'BES Cyber Asset Inventory', searchPlaceHolderText: 'Search in BES Cyber Asset Inventory',dataClassification:"Data is PG&E Restricted" },
                            'auditlogs': { heading: 'Admin Audit Log', searchPlaceHolderText: 'Search in Admin Audit Log' }
                        };
                        var _activePath = $location.path().split('/');
                        $scope.placeHolderText = _activeRoute[_activePath[1].toLowerCase()].searchPlaceHolderText;
                        $scope.heading = _activeRoute[_activePath[1].toLowerCase()].heading;
            			$scope.dataClassification = _activeRoute[_activePath[1].toLowerCase()].dataClassification;
                        element.find('#txtSearchString').bind('input propertychange', function (e) {
                            var prev = $scope.searchText;
                            $scope.searchText =$.trim(e.currentTarget.value);
                            //$scope.searchTextData = $scope.searchText;
                            //if(prev !=$scope.searchText ) {
                                $scope.$evalAsync($scope.filterGridRecord()($scope.searchText));
                            //}
                        });
                        $scope.filterKendoGridRecords = function () {
                            $scope.$evalAsync($scope.filterGridRecord()($scope.searchText));
                        };

                        $scope.exportToExcel = function () {
                            $scope.$evalAsync($scope.exportTo()('excel'));
                        };

                        $scope.exportToPDF = function () {
                            $scope.$evalAsync($scope.exportTo()('pdf'));
                        };

                        $scope.exportToCsv = function () {
                            $scope.$evalAsync($scope.exportTo()('csv'));
                        }
                        $scope.showAllRecords = function () {
                            $location.url(_activeRoute[_activePath[1].toLowerCase()].showAll);
                        };
                        $scope.isSafari = localStorage.getItem("isSafari") == "true" ? true :false;
                    }
                }
            }
        ]);
    });
})();
