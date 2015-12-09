(function() {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service' ], function(app) {
        app.register.controller('forgotPasswordController', ['$scope', '$rootScope', 'forgotPasswordModel','authFormValidator','authService',
            function($scope, $rootScope, forgotPasswordModel, formValidator, authService) {
                $scope.initializeController = function() {
                    $scope.userInfo = forgotPasswordModel.initializeModel();
                    $scope.error = ''; //TODO: Default error object set
                }
                var onSuccess = function (resp) {
                    $scope.request=resp;
                    $scope.error = ''
                }
                $scope.forgotPassword = function() {
                    forgotPasswordModel.updateModel($scope.userInfo);

                    var forgotPasswordForm =  formValidator.isValidForgotPasswordForm();
                    if (forgotPasswordForm.isValid) {
                        authService.forgotPassword(onSuccess);
                        $scope.userInfo = forgotPasswordModel.initializeModel();
                    }
                    else{
                        $scope.error = forgotPasswordForm;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                }
            }
        ]);
    });
})();