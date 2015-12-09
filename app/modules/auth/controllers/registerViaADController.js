(function () {
    "use strict";
    define(['assetIt', 'auth-model', 'auth-formValidator', 'auth-service'], function (app) {
        app.register.controller('RegisterViaADController', ['authService', '$location',
            function (authService, $location) {
                var registerViaADController = this;
                registerViaADController.registerADUser = function () {
                    if (!registerViaADController.user) registerViaADController.user = {};
                    registerViaADController.user.error = {};
                    if (!registerViaADController.user.userName) {
                        registerViaADController.user.error.userNameError = "This field is required";
                    }
                    if (!registerViaADController.user.fullName) {
                        registerViaADController.user.error.fullNameError = "This field is required";
                    }
                    if (!registerViaADController.user.companyName) {
                        registerViaADController.user.error.companyNameError = "This field is required";
                    }
                    if (!registerViaADController.user.password) {
                        registerViaADController.user.error.passwordError = "This field is required";
                    } else if (registerViaADController.user.password.length < 5) {
                        registerViaADController.user.error.passwordError = "Please enter atleast 5 characters";
                    }
                    if (!registerViaADController.user.confirmPassword) {
                        registerViaADController.user.error.confirmPasswordError = "This field is required";
                    } else if (registerViaADController.user.confirmPassword.length < 5) {
                        registerViaADController.user.error.confirmPasswordError = "Please enter atleast 5 characters";
                    } else if (registerViaADController.user.confirmPassword !== registerViaADController.user.password) {
                        registerViaADController.user.error.confirmPasswordError = "Passwords do not match";
                    }
                    var errorHandler = function (error) {
                        registerViaADController.serverError = error.message;
                    };
                    if (Object.keys(registerViaADController.user.error).length == 0) {
                        authService.registerADUser({
                            username: registerViaADController.user.userName,
                            cnf_password: registerViaADController.user.confirmPassword,
                            companyName: registerViaADController.user.companyName,
                            fullName: registerViaADController.user.fullName,
                            password: registerViaADController.user.password,
                            requestAdmin: registerViaADController.user.isRequestForAdminAccess
                        }).then(function (response) {
                            if (response.isSuccess) {
                                $location.path('/successAction/registerADUser');
                            } else {
                                errorHandler(response);
                            }
                        }, function (error) {
                            errorHandler(error);
                        });
                    }
                }
            }
        ]);
    });
})();