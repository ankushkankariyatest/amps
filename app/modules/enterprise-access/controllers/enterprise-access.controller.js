/**
 * Created by Amit Thakkar on 09/07/15.
 */
(function () {
    define(['assetIt', 'enterprise-access-service', 'ui-bootstrap'], function (app) {
        app.register.controller('enterpriseAccessController', ['$scope', '$rootScope', 'enterpriseAccessService', 'authenticationFactory', 'notifyService', function ($scope, $rootScope, enterpriseAccessService, authenticationFactory, notifyService) {
            var validationMesssages = {
                isInvalidLanId: { message: "This is not a valid LAN ID", isValid: false },
                isEmpty: { message: "This field is required", isValid: false },
                sameLanIdAndSupervisorId: { message: "LAN ID and Supervisor LAN ID cannot be same", isValid: false },
                defaultErrorInfo: { isValid: true, message: '' }
            };
            var isValidLanID = function (emailId) {
                var inEmptyEmail = isNotEmpty(emailId);
                if (!inEmptyEmail.isValid) {
                    return inEmptyEmail;
                } else {
                    var lanId = emailId;
                    var emailIdParts = /(.*)@(.*)/.exec(emailId);
                    if (emailIdParts && emailIdParts[2]) {
                        lanId = emailIdParts[1];
                        if(lanId.toLowerCase() === authenticationFactory['lanid']){
                            return validationMesssages.sameLanIdAndSupervisorId;
                        }
                        else if (emailIdParts[2] == 'pge.com' && lanId.length == 4 && !/[^a-zA-Z0-9]/.test(lanId)) {
                            return validationMesssages.defaultErrorInfo;
                        } else {
                            return validationMesssages.isInvalidLanId;
                        }
                    } else {
                        if(lanId.toLowerCase() === authenticationFactory['lanid']){
                            return validationMesssages.sameLanIdAndSupervisorId;
                        }
                        return (/[^a-zA-Z0-9]/.test(lanId) || lanId.length != 4 ) ? validationMesssages.isInvalidLanId : validationMesssages.defaultErrorInfo;
                    }
                }
            };

            var isNotEmpty = function (data) {
                return (data !== undefined && String(data).trim() !== '') ? validationMesssages.defaultErrorInfo : validationMesssages.isEmpty;
            };

            $scope.enterprise = {
                lanId: authenticationFactory['lanid'],
                supervisorLanId: '',
                businessJustification: '',
                workOrder: authenticationFactory['workOrder']
            };
            $scope.submitEnterprise = function (modalOptions) {
                var enterpriseAccessForm = isValidLanID($scope.enterprise.supervisorLanId);
                if(!enterpriseAccessForm.isValid){
                    $scope.error = enterpriseAccessForm;
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                    return;
                }
                enterpriseAccessService.sendEnterpriseAccessRequest($scope.enterprise).then(function (resp) {
                    modalOptions.close();
                    if(resp.isSuccess){
                        notifyService.notifySuccess(
                            {
                                title: 'Asset Management Platform',
                                text: resp.message,
                                type: 'success'
                            }
                        );
                        if(resp.workOrder)
                            authenticationFactory.setWorkOrder(resp.workOrder);
                    }else{
                        $scope.error = {
                            isValid: resp.isSuccess,
                            message: resp.message
                        };
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                        return;
                    }
                });
            }
        }]);
    });
})();