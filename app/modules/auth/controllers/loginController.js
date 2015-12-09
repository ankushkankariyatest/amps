(function () {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service', 'common-Service'], function (app) {
        app.register.controller('loginController', ['$scope', '$rootScope', '$location', 'loginModel', 'authFormValidator', 'authService', 'commonService', 'configOptions',
            function ($scope, $rootScope, $location, loginModel, formValidator, authService, commonService, configOptions) {
                $scope.initializeController = function () {
                    $scope.loginInfo = loginModel.initializeModel();
                    $scope.error = ''; //TODO: Default error object set
                };
                //function setShowAlert(){
                //    localStorage.setItem("isAlertShow", true);
                //}
                //setShowAlert();
                $scope.authenticateUser = function () {
                    $scope.error = '';
                    $scope.request = '';
                    loginModel.updateModel($scope.loginInfo);
                    var loginForm = formValidator.isValidLoginForm();
                    if (loginForm.isValid) {
                        authService.login().then(function (resp) {
                            $scope.request = resp;
                            $location.path((undefined === window.currentRoute) ? '/home' : window.currentRoute);
                        }, function (error) {
                            $scope.request = error;
                        });
                        //$scope.loginInfo = loginModel.initializeModel();
                    }
                    else {
                        $scope.error = loginForm;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                }
            }]);
    });
})();