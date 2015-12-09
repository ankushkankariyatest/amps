/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 02/03/15
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['angularAMD'], function () {
        var app = angular.module('assetItAuthentication', []);
        app.factory('authenticationFactory', ["$cacheFactory", "$window", 'userRoles', function ($cacheFactory, $window, userRoles) {

                var auth = {
                    isLogged: false,
                    fullName: '',
                    user: '',
                    userRole: [],
                    userRoles: userRoles,
                    isAuthenticated  : false,
                    workOrder: '',
                    check: function () {
                        //if ($window.sessionStorage.token && $window.sessionStorage.user) //Remove window session storage code
                        if ($window.localStorage.token && $window.localStorage.user)
                        {
                            this.isLogged = true;
                        } else {
                            this.isLogged = false;
                            delete this.user;
                        }
                    },
                    setInfo: function (response) {
                        this.fullName = response.user.username;
                        this.user = response.user.email;
                        this.lanid = response.user.LAN_ID;
                        this.userRole = response.user.roles;
                        this.workOrder = response.user.workOrder;
                        //this.showAlert = true;
                        /*this.isNERC_CIP = response.user.isNERC_CIP;
                        this.isEnterprise = response.user.isEnterprise;
                        this.isAD_NERC_CIP = response.user.isAD_NERC_CIP;*/
                        //Remove window session storage code
                        /*$window.sessionStorage.token = response.token;
                         $window.sessionStorage.fullName = this.fullName;
                         $window.sessionStorage.user = this.user; // to fetch the user details on refresh
                         $window.sessionStorage.userRole = this.userRole; // to fetch the user details on refresh*/

                        $window.localStorage.token = response.token;
                        $window.localStorage.fullName = this.fullName;
                        $window.localStorage.user = this.user;
                        $window.localStorage.lanid = this.lanid;
                        $window.localStorage.userRole = this.userRole ? JSON.stringify(this.userRole): "";
                        $window.localStorage.workOrder = this.workOrder;
                        //$window.localStorage.showAlert = this.showAlert;
                        /*$window.localStorage.isNERC_CIP = this.isNERC_CIP;
                        $window.localStorage.isEnterprise = this.isEnterprise;
                        $window.localStorage.isAD_NERC_CIP = this.isAD_NERC_CIP;*/
                    },
                    setAuthInfoFromStorage: function () {
                        //Remove window session storage code
                        /*this.fullName = $window.sessionStorage.fullName;
                         this.user = $window.sessionStorage.user;
                         this.userRole = $window.sessionStorage.userRole;*/
                        this.fullName = $window.localStorage.fullName;
                        this.user = $window.localStorage.user;
                        this.lanid = $window.localStorage.lanid;
                        try{
                            this.userRole = JSON.parse($window.localStorage.userRole)
                        }catch(e){
                            this.userRole = [];
                        }
                        this.workOrder = $window.localStorage.workOrder;
                        //this.showAlert = $window.localStorage.showAlert;
                        /*this.isNERC_CIP = $window.localStorage.isNERC_CIP == "true";
                        this.isEnterprise = $window.localStorage.isEnterprise == "true";
                        this.isAD_NERC_CIP = $window.localStorage.isAD_NERC_CIP == "true";*/
                    },
                    clearInfo: function () {
                        this.isLogged = false;
                        this.isAuthenticated = false;

                        delete this.fullName;
                        delete this.user;
                        delete this.lanid;
                        delete this.userRole;
                        delete this.workOrder;
                        //delete this.showAlert;
                        /*delete this.isNERC_CIP;
                        delete this.isEnterprise;
                        delete this.isAD_NERC_CIP;*/

                        //Remove window session storage code
                        delete $window.localStorage.fullName;
                        delete $window.localStorage.token;
                        delete $window.localStorage.user;
                        delete $window.localStorage.lanid;
                        delete $window.localStorage.userRole;
                        delete $window.localStorage.workOrder;
                        //delete $window.localStorage.showAlert;
                        /*delete $window.localStorage.isNERC_CIP;
                        delete $window.localStorage.isEnterprise;
                        delete $window.localStorage.isAD_NERC_CIP;*/
                        $window.currentRoute = undefined;
                        //$window.localStorage.$reset();
                        //$cacheFactory.get('cache').removeAll();
                    },
                    isValidToken: function () {
                        /*return  $window.sessionStorage.token)*/ //Remove window session storage code
                        return $window.localStorage.token;
                    },
                    getAuthToken: function () {
                        /*return 'Bearer ' + $window.sessionStorage.token;//Remove window session storage code*/
                        return 'Bearer ' + $window.localStorage.token;
                    },
                    getUserName: function () {
                        /*return $window.sessionStorage.user;*///Remove window session storage code
                        return $window.localStorage.user;
                    },
                    setWorkOrder: function(workOrder){
                        $window.localStorage.workOrder = workOrder;
                        this.workOrder = workOrder;
                    },
                    getFullName: function(){
                        return $window.localStorage.fullName;
                    },
                    setFullName: function(fullName){
                        $window.localStorage.fullName = fullName;
                        this.fullName = fullName;
                    }
                    /*checkUserRole: function (role) {
                        return $window.localStorage.userRole == role ? true : false;
                    }
                    isUserNerccip: function() {
                        return ($window.localStorage.isNERC_CIP || $window.localStorage.isAD_NERC_CIP);
                    },
                    isUserEnterprise: function(){
                        return ($window.localStorage.isEnterprise);
                    }*/
                  /*  removeAlert: function(){
                        $window.localStorage.showAlert = false;
                    },
                    getAlert: function(){
                        return $window.localStorage.showAlert;
                    }*/
                };
                return auth;
            }]);
        app.factory('tokenInterceptor', ['$q', '$location', 'authenticationFactory',function ($q, $location, authenticationFactory) {

            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if (authenticationFactory.isValidToken())
                    {
                        config.headers.Authorization = authenticationFactory.getAuthToken();
                    }
                    return config;
                },
                requestError: function (rejection) {
                    return $q.reject(rejection);
                },
                /* Set Authentication.isAuthenticated to true if 200 received */
                response: function (response) {
                    if (response != null && response.status == 200 && authenticationFactory.isValidToken() && !authenticationFactory.isAuthenticated) {
                        authenticationFactory.isAuthenticated = true;
                    }
                    return response || $q.when(response);
                },
                /* Revoke client authentication if 401 is received */
                responseError: function (rejection) {
                    if (rejection != null && rejection.status === 403 && (authenticationFactory.isValidToken() || authenticationFactory.isAuthenticated)) {
                        //delete $window.sessionStorage.token;//Remove window session storage code
                        authenticationFactory.clearInfo();
                        authenticationFactory.isAuthenticated = false;
                        $location.path("/login");
                    }else{
                        // Special case for IE 10, check if server token is still valid
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
    });
})();
