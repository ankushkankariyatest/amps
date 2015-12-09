/// <reference path="modules/cyber-systems/controllers/cyber-systems.controller.js" />
/// <reference path="" />
/// <reference path="" />
"use strict";

define(['angularAMD', 'underscore', 'angular-route', 'bootstrap', 'ui-bootstrap', 'bootstrap-popup', 'angular-sanitize',
    'authentication-factory', 'header-footer', 'storage-factory'], function (angularAMD, _) {
        var appRequiredModules = [
            'ngRoute',
            'ngSanitize',
            'ui.bootstrap',
            'assetStorage'
        ];

        var externalModules = [
            'bootstrap-popup',
            'assetItAuthentication'
        ];

        var registerModules = appRequiredModules.concat(externalModules);
        var app = angular.module("mainModule", registerModules);

        var appConstantPath = {
            header: {
                templateUrl: 'app/modules/common/templates/header-template.html'
            },
            logOutPopup: {
                templateUrl: 'app/modules/common/templates/logOutPopup.html'
            },
            home: {
                controllerUrl: "modules/home/controllers/home.controller",
                templateUrl: "app/modules/home/templates/home.html"
            },
            feedback: {
                controllerUrl: 'modules/feedback/controllers/feedback.controller',
                templateUrl: 'app/modules/feedback/templates/feedback.html',
                successUrl: 'app/modules/feedback/templates/feedback-success.html',
                failureUrl: 'app/modules/feedback/templates/feedback-error.html'
            },
            application: {
                controllerUrl: 'modules/application/controllers/application.controller',
                multiProcessTemplateUrl: 'app/modules/application/templates/multiple-processes.html',
                multiLobsTemplateUrl: 'app/modules/application/templates/multiple-lobs.html',
                infraTabTemplateUrl: 'app/modules/application/templates/app-infra-tab.html',
                templateUrl: 'app/modules/application/templates/application.html',
                applicationSystemInfoControllerUrl: 'modules/application/controllers/bacr.controller',
                bacrTemplateUrl: 'app/modules/application/templates/appInfo/bacr.html',
                appSystemInfoTemplateUrl: 'app/modules/application/templates/appInfo/app-system-info.html',
                server: {
                    moreDetailsTemplateUrl: 'app/modules/application/templates/infra/app-infra-type-more-details.html'
                },
                database: {
                    moreDetailsTemplateUrl: 'app/modules/application/templates/infra/app-infra-type-more-details.html'
                },
                middleware: {
                    moreDetailsTemplateUrl: 'app/modules/application/templates/infra/app-infra-middleware-more-details.html'
                },
                certify: {
                    successUrl: "app/modules/application/templates/appInfo/bacr-success.html",
                    failureUrl: "app/modules/application/templates/appInfo/bacr-failure.html"
                }
            },
            error: {
                controllerUrl: 'modules/common/error/controllers/errorController',
                templateUrl: 'app/modules/common/error/templates/error.html'
            },
            loading: {
                templateUrl: 'app/modules/common/templates/preloader.html'
            },
            //mcps: {
            //    controllerUrl: 'modules/process/controllers/processListController',
            //    templateUrl: 'app/modules/process/templates/processList.html'
            //},
            mcps: {
                controllerUrl: 'modules/mcps/controllers/mcps.controller',
                templateUrl: 'app/modules/mcps/templates/mcps.html'
            },
            lobs: {
                controllerUrl: 'modules/lobs/controllers/lobs.controller',
                templateUrl: 'app/modules/lobs/templates/lobs.html'
            },
            users: {
                controllerUrl: 'modules/user/controllers/userController',
                templateUrl: 'app/modules/user/templates/users.html'
            },
            feedbackList: {
                controllerUrl: 'modules/feedbackList/controllers/feedback.controller',
                templateUrl: 'app/modules/feedbackList/templates/feedback.html'
            },
            certificationList: {
                controllerUrl: 'modules/certificationList/controllers/certification.controller',
                templateUrl: 'app/modules/certificationList/templates/certification.html'
            },
            sites: {
                controllerUrl: 'modules/sites/controllers/sites.controller',
                templateUrl: 'app/modules/sites/templates/sites.html'
            },
            siteExcelImport: {
                controllerUrl: 'modules/site-excel-import/controllers/site-excel-import.controller',
                templateUrl: 'app/modules/site-excel-import/templates/site-excel-import.html',
                groupModalUrl: 'app/modules/site-excel-import/templates/group-modal.html',
                successPopupUrl: 'app/modules/site-excel-import/templates/success-popup.html'
            },
            sitesUtility:{
                controllerUrl: 'modules/site-utility-module/controllers/site-utility-module.controller',
                templateUrl: 'app/modules/site-utility-module/templates/site-utility-module.html'
            },
            cyberSystems: {
                controllerUrl: 'modules/cyber-systems/controllers/cyber-systems.controller',
                templateUrl: 'app/modules/cyber-systems/templates/cyber-systems.html'
            },
            editUser: {
                controllerUrl: 'modules/user/controllers/editUser.controller',
                templateUrl: 'app/modules/user/templates/editUser.html'
            },
            //lobs: {
            //    controllerUrl: 'modules/lobs/controllers/lobListController',
            //    templateUrl: 'app/modules/lobs/templates/lobList.html'
            //},
            infra: {
                controllerUrl: 'modules/infra/controllers/infrastructure.controller',
                templateUrl: 'app/modules/infra/templates/infrastructure.html'
            },
            versionT: {
                templateUrl: "app/modules/common/templates/versionTemplate.html"
            },
            permalink: {
                templateUrl: "app/modules/common/templates/perma-link-popup.html"
            },
            siteUtilityVersionDiff : {
                controllerUrl: 'modules/site-utility-version-diff/controllers/site-utility-version-diff.controller',
                templateUrl: 'app/modules/site-utility-version-diff/templates/site-utility-version-diff.html'
            },
            splashConfiguration : {
                controllerUrl: 'modules/splash-configuration/controllers/splash-configuration.controller',
                templateUrl: 'app/modules/splash-configuration/templates/splash-configuration.html'
            },
            enterpriseAccess: {
                controllerUrl: 'modules/enterprise-access/controllers/enterprise-access.controller',
                templateUrl: 'app/modules/enterprise-access/templates/enterprise-access.html'
            },
            auditLogs: {
                controllerUrl: 'modules/audit-logs/controllers/audit-logs.controller',
                templateUrl: 'app/modules/audit-logs/templates/audit-logs.html'
            }
        };


        app.constant('appConstantPath', appConstantPath);

        app.decideHierarchyView = {
            viewId: 1,
            queramParamData: '',
            applicationSearchFilterText: ''
        };

        app.loadingUi = {
            start: function () {
                $('#pageLoader').show();
            },
            stop: function () {
                $('#pageLoader').hide();
            }
        };

        app.constant('loadingData', {
            start: function () {
                //$('#dataLoader').show();
                $('#dataLoader').clone().addClass('serviceCall').appendTo('#placeHolderLoading').show();
            },
            stop: function () {
                //$('#dataLoader').hide();
                if (typeof $('.serviceCall')[0]['remove']=="function") {
                    $('.serviceCall')[0].remove();
                } else {
                    $('.serviceCall')[0].removeNode(true);
                }

            }
        });

        app.filter("leadingZeroes", function () {
            return function (data) {
                var pad = "000" + data;
                pad = pad.substr(pad.length - 3);
                return pad;
            }
        });

        app.config(function ($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common["Accept"] = "*/*";
            $httpProvider.interceptors.push('tokenInterceptor');
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.timeout = 600000;
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        });

        var authConstantPath = {
            login: {
                controllerUrl: 'modules/auth/controllers/loginController',
                templateUrl: 'app/modules/auth/templates/login.html'
            },
            register: {
                controllerUrl: 'modules/auth/controllers/registerController',
                templateUrl: 'app/modules/auth/templates/register.html'
            },
            registerViaAD: {
                controllerUrl: 'modules/auth/controllers/registerViaADController',
                templateUrl: 'app/modules/auth/templates/registerViaAD.html'
            },
            authMessage: {
                controllerUrl: 'modules/auth/controllers/authMessageController',
                templateUrl: 'app/modules/auth/templates/authMessage.html'
            },
            resetPassword: {
                controllerUrl: 'modules/auth/controllers/resetPasswordController',
                templateUrl: 'app/modules/auth/templates/resetPassword.html'
            },
            forgotPassword: {
                controllerUrl: 'modules/auth/controllers/forgotPasswordController',
                templateUrl: 'app/modules/auth/templates/forgotPassword.html'
            }
        };
        app.constant('authConstantPath', authConstantPath);

        app.config(['$routeProvider', '$locationProvider', 'userRoles', function ($routeProvider, $locationProvider, userRoles) {
            //$locationProvider.html5Mode(false);

            $routeProvider
                    .when("/login", angularAMD.route({
                        templateUrl: authConstantPath.login.templateUrl,
                        controllerUrl: authConstantPath.login.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/register", angularAMD.route({
                        templateUrl: authConstantPath.register.templateUrl,
                        controllerUrl: authConstantPath.register.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/registerViaAD", angularAMD.route({
                        templateUrl: authConstantPath.registerViaAD.templateUrl,
                        controllerUrl: authConstantPath.registerViaAD.controllerUrl,
                        controller: "RegisterViaADController",
                        controllerAs: "registerViaADController",
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/confirmUser/:activationKey", angularAMD.route({
                        templateUrl: authConstantPath.authMessage.templateUrl,
                        controllerUrl: authConstantPath.authMessage.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/adminAccess/:activationKey", angularAMD.route({
                        templateUrl: authConstantPath.authMessage.templateUrl,
                        controllerUrl: authConstantPath.authMessage.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/successAction/:messageType", angularAMD.route({
                        templateUrl: authConstantPath.authMessage.templateUrl,
                        controllerUrl: authConstantPath.authMessage.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/resetPassword/:resetKey", angularAMD.route({
                        templateUrl: authConstantPath.resetPassword.templateUrl,
                        controllerUrl: authConstantPath.resetPassword.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/forgotPassword", angularAMD.route({
                        templateUrl: authConstantPath.forgotPassword.templateUrl,
                        controllerUrl: authConstantPath.forgotPassword.controllerUrl,
                        access: {
                            requiredLogin: false
                        }
                    }))
                    .when("/home", angularAMD.route({
                        templateUrl: appConstantPath.home.templateUrl,
                        controllerUrl: appConstantPath.home.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    /* .when("/error", angularAMD.route({
                     templateUrl: function(rp) { return 'app/modules/common/templates/error.html'; },
                     controllerUrl: "modules/common/error/controllers/errorController",
                     access: { requiredLogin: false }
                     }))*/
                    .when("/applications", angularAMD.route({
                        templateUrl: appConstantPath.application.templateUrl,
                        resolve: {
                            load: ['$q', '$rootScope', function ($q, $rootScope) {
                                var loadController = appConstantPath.application.controllerUrl;
                                var deferred = $q.defer();
                                require([loadController], function () {
                                    $rootScope.$apply(function () {
                                        deferred.resolve();
                                    });
                                });
                                return deferred.promise;
                            }]
                        },
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/applications/:id", angularAMD.route({
                        templateUrl: appConstantPath.application.templateUrl,
                        controllerUrl: appConstantPath.application.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/mcps", angularAMD.route({
                        templateUrl: appConstantPath.mcps.templateUrl,
                        controllerUrl: appConstantPath.mcps.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/lobs", angularAMD.route({
                        templateUrl: appConstantPath.lobs.templateUrl,
                        controllerUrl: appConstantPath.lobs.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/mcps/:code", angularAMD.route({
                        templateUrl: appConstantPath.mcps.templateUrl,
                        controllerUrl: appConstantPath.mcps.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/lobs/:name", angularAMD.route({
                        templateUrl: appConstantPath.lobs.templateUrl,
                        controllerUrl: appConstantPath.lobs.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/users", angularAMD.route({
                        templateUrl: appConstantPath.users.templateUrl,
                        controllerUrl: appConstantPath.users.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.admin]
                        }
                    }))
                    .when("/feedback", angularAMD.route({
                        templateUrl: appConstantPath.feedbackList.templateUrl,
                        controllerUrl: appConstantPath.feedbackList.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.admin]
                        }
                    }))
                    .when("/certifications", angularAMD.route({
                        templateUrl: appConstantPath.certificationList.templateUrl,
                        controllerUrl: appConstantPath.certificationList.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.admin]
                        }
                    }))
                    .when("/sites", angularAMD.route({
                        templateUrl: appConstantPath.sitesUtility.templateUrl,
                        controllerUrl: appConstantPath.sitesUtility.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.nercCip]
                        }
                    }))
                    .when("/siteExcelImport", angularAMD.route({
                        templateUrl: appConstantPath.siteExcelImport.templateUrl,
                        controllerUrl: appConstantPath.siteExcelImport.controllerUrl,
                        controller: "siteExcelImportController",
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.nercCip]
                        }
                    }))
                    .when("/infrastructure", angularAMD.route({
                        templateUrl: function () {
                            return appConstantPath.infra.templateUrl;
                        },
                        controllerUrl: appConstantPath.infra.controllerUrl,
                        access: {
                            requiredLogin: true
                        }
                    }))
                    .when("/VersionDiff", angularAMD.route({
                        templateUrl: function () {
                            return appConstantPath.siteUtilityVersionDiff.templateUrl;
                        },
                        controllerUrl: appConstantPath.siteUtilityVersionDiff.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.nercCip]
                        }
                    }))
                    /*.when("/splashConfiguration", angularAMD.route({
                        templateUrl: function () {
                            return appConstantPath.splashConfiguration.templateUrl;
                        },
                        controllerUrl: appConstantPath.splashConfiguration.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.admin]
                        }
                    }))*/
                    .when("/auditLogs", angularAMD.route({
                        templateUrl: function () {
                            return appConstantPath.auditLogs.templateUrl;
                        },
                        controllerUrl: appConstantPath.auditLogs.controllerUrl,
                        access: {
                            requiredLogin: true,
                            roles: [userRoles.admin]
                        }
                    }))
                    .otherwise({
                        redirectTo: '/login'
                    })
        }]);
        app.run(function ($rootScope, $window, $location, $interval, authenticationFactory, $q, popupService, headerFooterDecisionMaker, idleLogout, configUrl, $http) {
            app.loadingUi.start();
            idleLogout();
            authenticationFactory.check();// when the page refreshes, check if the user is already logged in
            headerFooterDecisionMaker.defineHeader($rootScope);
            $rootScope.isAlert = false;
            /* SPLASH MESSAGE CONFIGURATION */
          /*  $http.get(configUrl.authServiceUrl+'announcement').success(function (resp) {
                if(resp){
                    // ALERT
                    if(resp['alert'] && resp['alert'].length > 0) {
                        $rootScope.isAlert = resp['alert'][0].isActive;
                        $rootScope.alertData = resp['alert'][0];
                    }
                    // Announcements
                    if(resp['announcement'] && resp['announcement'].length > 0){
                        $rootScope.splashAnnouncements = resp['announcement'][0];
                    }

                }
            }); */

            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
                app.loadingUi.start();
                if ((nextRoute.access && nextRoute.access.requiredLogin) && !authenticationFactory.isLogged) {
                    window.currentRoute = $location.path();
                    $location.path("/login");
                } else {
                    headerFooterDecisionMaker.defineHeader($rootScope);
                    // check if user object exists else fetch it. This is incase of a page refresh
                    authenticationFactory.setAuthInfoFromStorage();
                    if ((nextRoute.access && nextRoute.access.roles) && (_.intersection(nextRoute.access.roles, authenticationFactory.userRole).length <= 0)) {
                        $location.path(getDefaultLandingScreen());
                    }
                }
            });

            function getDefaultLandingScreen(){
                //if(authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.enterprise) > -1){
                //    return '/home';
                //}
                //if(authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.nercCip) > -1){
                //    return '/sites';
                //}
                //if(authenticationFactory.userRole.indexOf(authenticationFactory.userRoles.admin) > -1){
                //    return '/users';
                //}
                return '/home';
            }

            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {
                // if the user is already logged in, take him to the home page
                if (authenticationFactory.isLogged == true && $location.path() == '/login') {
                    $location.path(getDefaultLandingScreen());
                }
            });

            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
                app.loadingUi.stop();
            });

            $rootScope.$on('$viewContentLoaded', function () {
                app.loadingUi.stop();
            });
            $rootScope.openFeedback = function (context, appId) {
                $rootScope.appId = appId;
                $rootScope.context = context;
                var deferred = $q.defer();
                require([appConstantPath.feedback.controllerUrl], function () {
                    $rootScope.$apply(function () {
                        deferred.resolve(popupService.showFeedbackPopup());
                    });
                });
                return deferred.promise;
            };
            $rootScope.openEnterpriseAccess = function () {
                var deferred = $q.defer();
                require([appConstantPath.enterpriseAccess.controllerUrl], function () {
                    $rootScope.$apply(function () {
                        deferred.resolve(popupService.showEnterpriseAccessPopup());
                    });
                });
                return deferred.promise;
            };
            $rootScope.isSafari = localStorage.getItem("isSafari") == "true" ? true :false;


            $(document).on('click', 'tbody .permalink-wrapper', function (e) {
                var loc = window.location;
                var _targt = $(e.currentTarget);
                var baseUrl = loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "") + loc.pathname + "#/" + _targt.attr("attr-base") + "/" + _targt.attr("attr-permalink-key");
                var _model = {
                    key: baseUrl
                };
                popupService.showPermalinkPopup(_model);
            });
        });

        angular.element(document).ready(function () {
            var initInjector = angular.injector(["ng"]);
            var $http = initInjector.get("$http");
            var $window = initInjector.get("$window");
            $http.get('config.json').then(function (resp) {
                resp.data.baseUrl.secureUrl = resp.data.baseUrl.authServiceUrl + resp.data.baseUrl.secureUrl;

                app.constant('configUrl', resp.data.baseUrl);
                app.constant('configOptions', resp.data.options);
                app.constant('environments', resp.data.environments);
                app.constant('userRoles', resp.data.userRoles);
                app.constant("autoLogOutMinutes", resp.data.autoLogOutMinutes);
                app.constant("externalLinks", resp.data.externalLinks);
                app.constant("besDefaultColumns", resp.data.besDefaultColumns);
                app.constant("isMobileView", $window.innerWidth< 768);
                angularAMD.bootstrap(app); // Bootstrap Angular when DOM is ready
            }, function (error) {
                throw new Error('Config file has error : ' + error);
            });
        });

        app.factory('idleLogout', ['$window', 'autoLogOutMinutes', 'authenticationFactory', 'popupService', 'authService',
            function (window, autoLogOutMinutes, authenticationFactory, popupService, authService) {
                var idleLogout = function () {
                    var t;
                    window.onload = resetTimer;
                    window.onmousemove = resetTimer;
                    window.onmousedown = resetTimer; // catches touchscreen presses
                    window.onclick = resetTimer;     // catches touchpad clicks
                    window.onscroll = resetTimer;    // catches scrolling with arrow keys
                    window.onkeypress = resetTimer;

                    function logout() {
                        if (authenticationFactory.isLogged) {
                            authService.logout();
                            popupService.openLogOutPopup().then(function () {
                                window.location.reload(true);
                            }, function () {
                                window.location.reload(true);
                            });
                        }
                    }

                    function resetTimer() {
                        clearTimeout(t);
                        t = setTimeout(logout, parseInt(autoLogOutMinutes) * 60 * 1000);  // time is in milliseconds
                    }
                };
                return idleLogout;
            }]);
        return app;
    });
