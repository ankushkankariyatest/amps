/**
 * Created by wizdev on 8/3/2015.
 */
(function (ng) {
    "use strict";
    define(['assetIt', 'versionService'], function (app) {
        app.register
            .directive('versionCompare', ['versionService', function (versionService) {
                return {
                    restrict: "AE",
                    templateUrl: 'app/modules/site-utility-version-diff/templates/version-compare.html',
                    link: function ($scope, element, attr) {
                    },
                    controller: function ($scope) {
                        var versionModel = this;
                        var sheetNamesWithNoKeysDefined = ['ChangeLog', 'EACMS', 'PACS'];
                        versionModel.limitToCounter = 20;
                        versionModel.limitOuter = 20;
                        versionModel.fromDateObject = null;
                        versionModel.toDateObject = null;
                        versionModel.maxDate = new Date();
                        versionModel.changeExists = true;
                        versionModel.fromDateChanged = function () {
                            versionModel.toDateObject = null;
                            versionModel.toDateString = null;
                        };
                        versionModel.toDateChanged = function () {
                        };

                        versionModel.showDiff = function () {
                            var option = this;
                            var tomorrowDate = angular.copy(option.toDateObject);
                            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                            var _model = {
                                sheet: option.selectedSheet,
                                fromVersion: option.fromDateObject.getTime(),
                                toVersion: tomorrowDate.getTime()
                            };
                            if (!_model.sheet || !_model.fromVersion || !_model.toVersion) {
                                return;
                            }

                            var _findObj = _.find(versionModel.sheetNameAndLatestVersion, {sheetName: option.selectedSheet});
                            versionModel.cols = _findObj.masterheaders;
                            versionService.getSheetData(_model).then(function (resp) {
                                versionModel.historyRowData = resp.data;
                                versionModel.fromDateResp = option.fromDateObject;
                                versionModel.toDateResp = option.toDateObject;
                                versionModel.summaryCountFrom = resp.countFrom;
                                versionModel.summaryCountTo = resp.countTo;
                                versionModel.primaryKeys = _findObj.primaryKey;
                                versionModel.selectedSheetName = _findObj.displayName;
                            });

                        };
                        versionModel.loadImportRecord = function (historyRecord) {
                            historyRecord.showLoading = true;
                            var option = this;
                            var _model = {
                                sheetName: option.selectedSheet,
                                startTime: historyRecord.startTime
                            };
                            versionService.getImportRecord(_model).then(function (resp) {
                                historyRecord.dataObject = resp;
                                historyRecord.showLoading = false;
                            }, function (error) {
                                historyRecord.showLoading = false;
                                historyRecord.error = error;
                            });

                        };
                        versionModel.loadDiffData = function (model) {
                            model.showLoading = true;
                            var option = this;
                            var recordKey = {};
                            // Format Keys for API call
                            _.each(option.primaryKeys, function(item, index){
                                recordKey[item] = model.recordData[item];
                            });
                            var _model = {
                                sheetName: option.selectedSheet,
                                version: model.version,
                                key: recordKey
                            };
                            versionService.getDiffData(_model).then(function (resp) {
                                resp = _.sortBy(resp, 'version').reverse();
                                if (resp.length === 2) {
                                    model.isReAdded = resp[1].isRemoved;
                                    model.comparerKeys = _.union(Object.keys(resp[0].recordData), Object.keys(resp[1].recordData));
                                    model.currentData = resp[0].recordData;
                                    model.previousData = resp[1].recordData;
                                }
                                model.showLoading = false;
                            }, function (error) {
                                model.showLoading = false;
                                model.error = error;
                            });
                        };
                        versionModel.changeSheetName = function(val){
                            versionModel.selectedSheet = val.sheetName;
                            versionModel.showSelectedSheet = val.displayName;
                        }
                        versionService.getSheetNameAndLatestVersion().then(function (resp) {
                            versionModel.sheetNameAndLatestVersion = $scope.sheetData = _.filter(resp, function (item, index) {
                                return $.inArray(item.sheetName, sheetNamesWithNoKeysDefined) === -1;
                            });
                        }, function (resp) {
                            versionModel.sheetNameAndLatestVersion = [];
                        });
                        $scope.diff = versionModel;
                    }
                };
            }]);
    });
})(angular);