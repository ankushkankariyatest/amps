/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 4:27 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['angularAMD', 'bootstrap', 'ui-bootstrap'], function () {
        var app = angular.module('bootstrap-popup', ['ui.bootstrap']);
        app.factory("popupService", ['$q', "modalService", 'appConstantPath', '$timeout', function ($q, modalService, appConstantPath, $timeout) {
            var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
            var showFeedbackPopup = function () {
                modalDefaults.windowClass = 'feedback-popup';
                modalDefaults.templateUrl = appConstantPath.feedback.templateUrl;
                modalService.showModal(modalDefaults, {});
            };
            var showFeedbackSuccess = function () {
                modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.feedback.successUrl;
                modalService.showModal(modalDefaults, {})
                //$timeout(function() { modalService.close() }, 5000);
            };
            var showFeedbackError = function () {
                modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.feedback.failureUrl;
                modalService.showModal(modalDefaults, {})
                //$timeout(function() { modalService.close() }, 5000);
            };
            var showInfrastructurePopup = function () {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.infrastructure.templateUrl;
                modalService.showModal(modalDefaults, {});
            };
            var showInfrastructureDetails = function (_activeTab) {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.application[_activeTab].moreDetailsTemplateUrl;
                modalService.showModal(modalDefaults, {});
            };
            var openLogOutPopup = function () {
                modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.logOutPopup.templateUrl;
                return modalService.showModal(modalDefaults, {});
            };
            var showPopup = function (templateName) {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath[templateName].templateUrl;
                modalService.showModal(modalDefaults, {});
            };
            var showPermalinkPopup = function (model) {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.permalink.templateUrl;
                modalService.showModal(modalDefaults, model);
            };

            var showApplicationPopup = function (template) {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = template;
                modalService.showModal(modalDefaults, { });
            };
            var showApplicationBacrPopup = function (template) {
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = template;
                modalService.showModal(modalDefaults, { });
            };
            var showApplicationSystemInfoPopup = function (template) {
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = template;
                modalService.showModal(modalDefaults, { });
            };
            var showCertifySuccess = function () {
                modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.application.certify.successUrl;
                modalService.showModal(modalDefaults, {});
                //$timeout(function() { modalService.close() }, 5000);
            };
            var showCertifyError = function () {
                modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.application.certify.failureUrl;
                modalService.showModal(modalDefaults, {});
                //$timeout(function() { modalService.close() }, 5000);
            };
            var showGroupPopup = function () {
                //modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.siteExcelImport.groupModalUrl;
                modalService.showModal(modalDefaults, {});
                //$timeout(function() { modalService.close() }, 5000);
            };
            var importSuccessPopup = function (_message) {
                //modalService.close();
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = appConstantPath.siteExcelImport.successPopupUrl;
                modalService.showModal(modalDefaults, _message);
                //$timeout(function() { modalService.close() }, 5000);
            };
            var showOnboardingPopup = function (template, model) {
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = template;
                modalService.showModal(modalDefaults, model);
            };

            var showSiteUtils = function (model) {
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = 'app/modules/site-utility-module/templates/site-tabs/site-general-details.html';
                modalService.showModal(modalDefaults, model);
            };

            var closePopup = function () {
                modalService.close();
            };
            var _showSiteHistoryDetails = function(model){
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = 'app/modules/site-utility-module/templates/site-utility-history-popup.html';
                modalService.showModal(modalDefaults, model);
            };
            var _showSiteHistoryCompareDetails = function(model){
                modalDefaults.windowClass = 'bacr-popup';
                modalDefaults.templateUrl = 'app/modules/site-utility-module/templates/site-utility-history-compare-popup.html';
               return modalService.showModal(modalDefaults, model);
            };
            var _showSiteHistoryNoComparePopup = function(model){
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = 'app/modules/site-utility-module/templates/site-utility-history-compare-popup.html';
                return modalService.showModal(modalDefaults, model);
            };
            var _showDeletePermissionPopup = function(model){
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = 'app/modules/common/templates/confirmation-popup.html';
                return modalService.showModal(modalDefaults, model);
            };
            var _showEnterpriseAccessPopup = function(model){
                modalDefaults.windowClass = 'feedback-popup';
                modalDefaults.templateUrl = appConstantPath.enterpriseAccess.templateUrl;
                return modalService.showModal(modalDefaults, model);
            };
            return {
                showFeedbackPopup: showFeedbackPopup,
                showFeedbackSuccess: showFeedbackSuccess,
                showFeedbackError: showFeedbackError,
                showInfrastructurePopup: showInfrastructurePopup,
                showInfrastructureDetails: showInfrastructureDetails,
                showPopup: showPopup,
                closePopup: closePopup,
                openLogOutPopup: openLogOutPopup,
                showPermalinkPopup: showPermalinkPopup,
                showApplicationPopup: showApplicationPopup,
                showApplicationSystemInfoPopup:showApplicationSystemInfoPopup,
                showApplicationBacrPopup:showApplicationBacrPopup,
                showCertifySuccess: showCertifySuccess,
                showCertifyError: showCertifyError,
                showOnboardingPopup:showOnboardingPopup,
                showSiteUtils:showSiteUtils,
                showGroupPopup:showGroupPopup,
                importSuccessPopup: importSuccessPopup,
                showSiteHistoryDetails: _showSiteHistoryDetails,
                showSiteHistoryCompareDetails: _showSiteHistoryCompareDetails,
                showSiteHistoryNoComparePopup: _showSiteHistoryNoComparePopup,
                showDeletePermissionPopup: _showDeletePermissionPopup,
                showEnterpriseAccessPopup: _showEnterpriseAccessPopup
            }
        }]);
        app.service("modalService", ["$modal", function ($modal) {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '',
                windowClass: ''
            };
            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };
            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };
            var modelInstance;
            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = ['$scope', '$modalInstance',function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $modalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $modalInstance.dismiss('cancel');
                        };
                        modelInstance = $modalInstance;
                    }];
                }
                return $modal.open(tempModalDefaults).result;
            };

            this.close = function () {
                if (undefined != modelInstance) {
                    modelInstance.close();
                }
            };
        }]);
    });
})();