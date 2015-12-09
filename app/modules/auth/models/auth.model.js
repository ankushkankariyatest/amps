/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 2:59 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['angularAMD'], function () {
        var app = angular.module('assetItAuthentication');

        app.factory('loginModel', function () {
            var loginModel = {username: '', password: ''};
            var model = {};
            model.initializeModel = function () {
                return {
                    username: '',
                    password: ''
                };
            }
            model.getModel = function () {
                return loginModel;
            }
            model.updateModel = function (loginInfo) {
                loginModel = loginInfo;
                loginModel.username = loginInfo.username;
            };
            model.getUsername = function () {
                return loginModel.username;
            };
            model.getPassword = function () {
                return loginModel.password;
            };
            return model;
        });
        app.factory('registerModel', ['$location', function ($location) {
                var registerModel = {
                    username: '',
                    password: '',
                    supervisorLanId:'',
                    requestAdmin: false, //default values 0 or 1
                    url: '',
                    urlAdmin: '',
                    requestEnterprise: false,
                    businessJustification: ''

                };
                var model = {};
                model.initializeModel = function () {
                    return {
                        username: '',
                        password: '',
                        supervisorLanId:'',
                        requestAdmin: 0,
                        url: '',
                        urlAdmin: '',
                        requestEnterprise: 0,
                        businessJustification: ''

                    };
                };
                model.getModel = function () {
                    return registerModel;
                };
                model.updateModel = function (registrationInfo) {
                    registrationInfo.requestAdmin = (registrationInfo.requestAdmin) ? 1 : 0;
                    registrationInfo.username = String(registrationInfo.username).toLowerCase();
                    registerModel = registrationInfo;
                };
                model.getUsername = function () {
                    return registerModel.username;
                };
                model.getPassword = function () {
                    return registerModel.password;
                };
                model.getSupervisorLanId = function () {
                    return registerModel.supervisorLanId;
                };
                model.getBusinessJustification = function () {
                    return registerModel.businessJustification;
                };
                model.getRequestEnterprise = function () {
                    return registerModel.requestEnterprise;
                };
                return model;
            }]);
        app.factory('forgotPasswordModel', function () {
            var forgotPasswordModel = {
                username: '',
                url: ''
            };

            var model = {};
            model.initializeModel = function () {
                return {
                    username: '',
                    url: ''
                };
            }
            model.getModel = function () {
                return forgotPasswordModel;
            };
            model.updateModel = function (forgotPasswordInfo) {
                forgotPasswordInfo.username = (forgotPasswordInfo.username.indexOf('@') == -1) && forgotPasswordInfo.username.length == 4 ? forgotPasswordInfo.username + '@pge.com' : forgotPasswordInfo.username;
                forgotPasswordModel = forgotPasswordInfo;
            };

            model.getUsername = function () {
                return forgotPasswordModel.username;
            };

            return model;
        });
        app.factory('resetPasswordModel', function () {
            var resetPasswordModel = {
                password: '',
                cnf_password: ''
            };

            var model = {};
            model.initializeModel = function () {
                return {
                    password: '',
                    cnf_password: ''
                };
            }
            model.getModel = function () {
                return resetPasswordModel;
            };
            model.updateModel = function (resetPasswordInfo) {
                resetPasswordModel = resetPasswordInfo;
            };
            model.getPassword = function () {
                return resetPasswordModel.password;
            }
            model.getCnfPassword = function () {
                return resetPasswordModel.cnf_password;
            }

            return model;
        });
    });
})();