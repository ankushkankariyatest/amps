/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 04/03/15
 * Time: 10:20 PM
 * To change this template use File | Settings | File Templates.
 */

(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.directive('authConstant', ['$location', 'registerModel', 'authService', function ($location, registerModel, authService) {
                return {
                    restrict: "AE",
                    scope: {},
                    template: '<div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 assetIT-main-login_container">\
                    <h1>{{ showMessage.heading }}</h1>\
                        <form>\
                            <section class="success_message">\
                                <div id="messageBody" class="text-center" ng-bind-html="showMessage.message"></div>\
                                <span class="icon-check-ok pull-right" ng-show="showMessage.success==true"></span>\
                                <div class="clearfix"></div>\
                            </section>\
                        </form>\
                        <div>\
                        <p class="text-center" ng-show="showMessage.showLoginLink">\
                            Continue to <a href="#login">Login</a>.\
                        </p>\
                    </div>\
                </div>',
                    link: function (scope, element, attr) {
                        var messages = {
                            register: {
                                success: true,
                                heading: 'Registration Successful',
                                message: '<h5 class="text-center">Thank you for registering with AMPS</h5> <p class="text-center">You will be receiving an email shortly at <strong>{email}</strong><br /></p>',
                                showLoginLink: true
                            },
                            registerADUser: {
                                success: true,
                                heading: 'Registration Successful',
                                message: '<h5 class="text-center">Thank you for registering with AMPS</h5>'
                            },
                            forgotPassword: {
                                success: true,
                                heading: 'Forgot Password',
                                message: '<p>An email has been sent to your registered email address, please click the link in the email to complete the password reset process.</p>',
                                showLoginLink: true
                            },
                            resetPassword: {
                                success: true,
                                heading: 'Password Reset Successful',
                                message: '<p>Your password has been successfully reset. <br />You can login using <a href="#login">this link</a></p>',
                                showLoginLink: false
                            },
                            confirmUserSuccess: {
                                success: true,
                                heading: "Activate Account",
                                message: "<p>Thank you for registering. Your account has been activated. You can login using <a href='#login'>this link</a></p>",
                                showLoginLink: false
                            },
                            adminAccessSuccess: {
                                success: true,
                                heading: "Admin Access Approval",
                                message: "<p>Admin access has been provided to the User</p>",
                                showLoginLink: true
                            },
                            error: {
                                success: false,
                                heading: "404 Not Found",
                                message: "Invalid request. Please check the link and try again.",
                                showLoginLink: true
                            }
                        };

                        var _getAuthMessage = function (messageType) {
                            var _messageInfo = messages[messageType];
                            if (!_messageInfo) {
                                _messageInfo = messages['error'];
                            }
                            return _messageInfo;
                        }

                        var confirmUserSuccess = function (isSuccess) {
                            return (isSuccess) ? _getAuthMessage('confirmUserSuccess') : _getAuthMessage('error');
                        }

                        var adminAccessSuccess = function (isSuccess) {
                            return (isSuccess) ? _getAuthMessage('adminAccessSuccess') : _getAuthMessage('error');
                        }
                        var decisionMaker = {
                            confirmUser: {
                                callService: authService.confirmUser,
                                callSuccess: confirmUserSuccess
                            },
                            adminAccess: {
                                callService: authService.adminAccess,
                                callSuccess: adminAccessSuccess
                            }
                        };
                        var getDecisionMakerBasedonPath = function (parentPath) {
                            return decisionMaker[parentPath];
                        };

                        var initialize = function () {
                            var path = $location.path();
                            var parsePath = path.split("/");
                            var parentPath = parsePath[1];
                            var messageType = parsePath[2];

                            var _messageInfo = _getAuthMessage(messageType);
                            _messageInfo.message = String(_messageInfo.message).replace('{email}', registerModel.getUsername());
                            if (parentPath == 'confirmUser' || parentPath == 'adminAccess') {
                                var serviceDetails = getDecisionMakerBasedonPath(parentPath);
                                serviceDetails.callService(messageType).then(function (resp) {
                                    scope.showMessage = serviceDetails.callSuccess(resp.isSuccess);
                                }, function () {
                                    scope.showMessage = serviceDetails.callSuccess(false);
                                });
                            } else {
                                scope.showMessage = _messageInfo;
                            }
                        }
                        initialize();
                    }
                };
            }]);
    })
})();