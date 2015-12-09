(function () {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service'], function (app) {
        app.register.controller('resetPasswordController', ['$scope', '$location', 'resetPasswordModel', 'authFormValidator', 'authService',
            function ($scope, $location, resetPasswordModel, formValidator, authService) {
                var path = $location.path();
                var parsePath = path.split("/");
                var parentPath = parsePath[1];
                var resetKey = parsePath[2];
                $scope.initializeController = function () {
                    $scope.request = {};
                    authService.checkResetLink(resetKey)
                            .then(function (response) {
                                $scope.request = response;
                                $scope.userInfo = resetPasswordModel.initializeModel();
                                $scope.error = '';
                            }, function (data, status) {
                                $scope.request = data;
                            });
                };

                var onSuccess = function (resp) {
                    $scope.request = resp;
                    $scope.error = ''
                }

                $scope.savePassword = function () {
                    resetPasswordModel.updateModel($scope.userInfo);

                    var resetPasswordForm = formValidator.isValidResetPasswordForm();

                    if (resetPasswordForm.isValid) {
                        authService.resetPassword(resetKey, onSuccess);
                        $scope.userInfo = resetPasswordModel.initializeModel();
                    }
                    else {
                        $scope.error = resetPasswordForm;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }

                };
            }
        ]);
    });
})();