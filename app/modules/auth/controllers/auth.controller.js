/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 19/02/15
 * Time: 11:36 PM
 * To change this template use File | Settings | File Templates.
 */
/*
(function () {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service'], function (app) {
        app.register.controller('authController', ['$scope', '$rootScope', 'loginModel','authFormValidator','authService',
            function ($scope, $rootScope, loginModel, formValidator, authService) {
                $scope.initializeController = function() {
                    $scope.loginInfo = loginModel.getModel();
                    $scope.error = '';
                };
                $scope.authenticateUser = function() {
                    loginModel.updateModel($scope.loginInfo);
                    if (formValidator.isValidLoginForm()) {
                        authService.login();
                    }
                }
            }]);
    });
})();*/
