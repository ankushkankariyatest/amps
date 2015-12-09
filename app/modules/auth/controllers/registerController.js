(function () {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service'], function (app) {
        app.register.controller('registerController', ['$scope', 'registerModel', 'authFormValidator', 'authService',
            function ($scope, registerModel, formValidator, authService) {
                $scope.initializeController = function () {
                    $scope.userInfo = registerModel.initializeModel();
                    $scope.showenterprise = false;
                    $scope.error = '';
                };
                var onSuccess = function (resp) {
                    $scope.request = resp;
                    $scope.error = ''
                };
                $scope.registerUser = function () {
                    $scope.error = '';
                    $scope.request = '';
                    registerModel.updateModel($scope.userInfo);
                    var registerForm = formValidator.isValidRegisterForm();
                    if (registerForm.isValid) {
                        authService.register(onSuccess);
                        $scope.userInfo = registerModel.initializeModel();
                    }
                    else {
                        $scope.error = registerForm;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                };
            }
        ]);
    });
})();