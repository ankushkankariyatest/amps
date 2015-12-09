/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 2:28 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['angularAMD', 'authentication-factory', 'auth-model'], function () {
        var app = angular.module('assetItAuthentication');
        app.factory('authService', ['$q', '$location', '$http', 'configUrl', 'authenticationFactory', 'loginModel', 'registerModel', 'forgotPasswordModel', 'resetPasswordModel', 'loadingData' , 'svcStorage',
            function ($q, $location, $http, configUrl, authenticationFactory, loginModel, registerModel, forgotPasswordModel, resetPasswordModel, loadingData, svcStorage) {
                var service = {};
                var defaultError = {
                    isSuccess: false,
                    message: "Oops! Got an error. Try again"
                };
                var sendEmail = function(req, res){
                    if(configUrl.sendErrorInMail) {
                        var params = {
                            "from": "am4it@wizni.com",
                            "to": configUrl.errorEmailReceipient,
                            "subject": "AMPS Front End Error",
                            "html": "Request <br />"+JSON.stringify(req)+"<br /><br/>Response <br />"+JSON.stringify(res)
                        };
                        $http({
                            url: configUrl.baseServiceUrl+"sendemail",
                            method: 'POST',
                            data: params
                        }).then();
                    }
                };
                var authHttp = function (request) {
                    loadingData.start(); //Show Loader
                    request.url = configUrl.authServiceUrl + request.url;
                    request.cache = false;
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingData.stop(); //Show Loader
                        deferred.resolve(response);
                    }).error(function (response) {
                        loadingData.stop(); //Show Loader
                        sendEmail(request, response);
                        deferred.reject(response);
                    });
                    return deferred.promise;
                };
                var httpGetSplash = function (request, route, successFunction, errorFunction) {
                    request.url = configUrl.authServiceUrl + request.url;
                    request.cache = false;
                    var cacheKey = request.url;
                    var appCache = svcStorage.get(cacheKey);
                    var deferred = $q.defer();
                    if (appCache) {
                        deferred.resolve(appCache);
                    }
                    else {
                        loadingData.start(); // Show Loader
                        $http(request).success(function (response) {
                            loadingData.stop(); //hide loader
                            svcStorage.put(cacheKey, response);
                            deferred.resolve(response);
                        }).error(function (xhr, status, error, exception) {
                            loadingData.stop(); //hide loader
                            sendEmail(request, xhr);
                            //notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                            deferred.reject(xhr);
                        });
                    }
                    return deferred.promise;
                }

                service.login = function () {
                    var loginForm = loginModel.getModel();
                    var userNameParts = /(.*)@.*/.exec(loginForm.username);
                    if(!userNameParts || !userNameParts.length) {
                        loginForm.username += '@pge.com';
                    }
                    var request = { method: 'POST', url: 'loginViaActiveDirectory', data: JSON.stringify(loginForm) };
                    var deferred = $q.defer();
                    authHttp(request)
                        .then(function (response) {
                            if (response.isSuccess) {
                                authenticationFactory.isLogged = true;
                                authenticationFactory.setInfo(response);
                                deferred.resolve(response);
                            } else {
                                authenticationFactory.clearInfo();
                                deferred.reject(response);
                            }
                        }, function (status) {
                            deferred.reject(defaultError);
                        });
                    return deferred.promise;
                };
                service.logout = function () {
                    if (authenticationFactory.isLogged) {
                        var request = {
                            method: 'POST',
                            url: 'logout',
                            data: JSON.stringify({ username: authenticationFactory.user })
                        };
                        var registerUrl = configUrl.authServiceUrl + "logout";
                        authHttp(request)
                            .then(function (response) {
                            }, function (status) {
                            });
                        authenticationFactory.clearInfo();
                        $location.path("/login");
                    }
                };
                service.register = function (onSuccess) {

                    var basePath = $location.absUrl().replace($location.path(), '');
                    var userInfo = registerModel.getModel();
                    var userNameParts = /(.*)@.*/.exec(userInfo.username);
                    if(!userNameParts || !userNameParts.length) {
                        userInfo.username += '@pge.com';
                    }
                    userInfo.url = basePath + '/confirmUser/';
                    if (userInfo.requestAdmin) {
                        userInfo.urlAdmin = basePath + '/adminAccess/';
                    }
                    var request = { method: 'POST', url: 'registerViaActiveDirectory', data: JSON.stringify(userInfo) };
                    authHttp(request)
                        .then(function (response) {
                            if (response.isSuccess) {
                                $location.path('/successAction/register');
                            }
                            else {
                                onSuccess(response);
                                //TODO : Decorator call
                            }
                        }, function (status) {
                            onSuccess(defaultError);
                        });
                };
                service.registerADUser = function (userInfo) {
                    var basePath = $location.absUrl().replace($location.path(), '');
                    userInfo.url = basePath + '/confirmUser/';
                    if (userInfo.requestAdmin) {
                        userInfo.urlAdmin = basePath + '/adminAccess/';
                    }
                    return authHttp({ method: 'POST', url: 'registerViaActiveDirectory', data: JSON.stringify(userInfo) });
                };
                service.forgotPassword = function (onSuccess) {

                    var basePath = $location.absUrl().replace($location.path(), '');
                    var userInfo = forgotPasswordModel.getModel();
                    userInfo.url = basePath + '/resetPassword/';
                    var request = { method: 'POST', url: 'forgotPassword', data: JSON.stringify(userInfo) };
                    authHttp(request)
                        .then(function (response) {
                            if (response.isSuccess) {
                                $location.path('/successAction/forgotPassword');
                            }
                            else {
                                onSuccess(response);
                                //TODO : Decorator call
                            }
                        }, function (status) {
                            onSuccess(defaultError);
                        });
                };
                service.resetPassword = function (userKey, onSuccess) {
                    var userInfo = resetPasswordModel.getModel();
                    var request = { method: 'POST', url: "resetPassword/" + userKey, data: JSON.stringify(userInfo) };
                    authHttp(request)
                        .then(function (response) {
                            if (response.isSuccess) {
                                $location.path('/successAction/resetPassword');
                            }
                            else {
                                onSuccess(response);
                                //TODO : Decorator call
                            }
                        }, function (status) {
                            onSuccess(defaultError);
                        });
                };
                service.checkResetLink = function (userKey) {
                    var request = { method: 'GET', url: "resetPassword/" + userKey };
                    return authHttp(request);
                };
                service.confirmUser = function (userKey) {
                    var request = { method: 'GET', url: "confirmEmail/" + userKey };
                    return authHttp(request);
                };
                service.adminAccess = function (userKey) {
                    var request = { method: 'GET', url: "adminAccess/" + userKey };
                    return authHttp(request);
                };
                service.getSplashData = function () {
                    var splashUtilityUrl = 'announcement';
                    var request = { method: "get", url:splashUtilityUrl};
                    return httpGetSplash(request);
                };
                return {
                    login: service.login,
                    logout: service.logout,
                    register: service.register,
                    registerADUser: service.registerADUser,
                    forgotPassword: service.forgotPassword,
                    resetPassword: service.resetPassword,
                    checkResetLink: service.checkResetLink,
                    adminAccess: service.adminAccess,
                    confirmUser: service.confirmUser,
                    getSplashData: service.getSplashData
                }
            }]);
    });
})();
