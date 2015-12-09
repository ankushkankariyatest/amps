/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 02/03/15
 * Time: 11:05 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['angularAMD', 'auth-service', 'bootstrap-popup'], function () {
        var app = angular.module('assetItAuthentication');
        app.factory('headerFooterDecisionMaker', ['$document', '$q', '$compile', 'authenticationFactory','configOptions', 'environments', "authService", function ($document, $q, $compile, authenticationFactory, configOptions, environments, authService) {
            var createHtml = {};
            createHtml.defineHeader = function ($rootScope) {
                var _document = $document[0];
                var myHeaderEl = angular.element(_document.getElementById('dynamic-header-info'));
                var myFooterEl = angular.element(_document.getElementById('dynamic-footer-info'));
                //var mySplashAlertE1 = angular.element(_document.getElementById('dynamic-site-alert'));
                myHeaderEl.empty();
                myFooterEl.empty();
                //mySplashAlertE1.empty();
                if (authenticationFactory.isLogged) {
                    myHeaderEl.append($compile('<div asset-header></div>')($rootScope));
                    myFooterEl.append($compile('<div class="asset-footer-anchor">Sprint Version: '+ configOptions.frontEndVersion + '<a class="pointer " data-ng-click="openFeedback()" >Feedback?</a></div>')($rootScope));
                    $rootScope.fullName = authenticationFactory.getFullName();
                }else{
                    var headerTemplate = '<div class="navbar-collapse collapse"><ul class="nav navbar-nav navbar-right assetIT-main-top-right"><li class="dropdown">' +
                        '<a class="dropdown-toggle" role="button" data-toggle="dropdown" href="javascript:void(0);">' +
                        '<span class="assetIT-header-nav_welcome_txt">' + environments.activeEnvironment + '<span class="caret"></span> </span></a>'+
                        '<ul id="environment" class="dropdown-menu" role="menu">';
                    _.each(environments.info, function(val,idx){
                        headerTemplate += '<li><a href="' + val.href + '">' + val.text + '</a></li>';
                    });
                    headerTemplate += '</ul></li></ul></div>';
                    myHeaderEl.append(headerTemplate);
                }
            }
            return createHtml
        }]);
        app.directive('assetHeader', ['$window', '$location', 'authenticationFactory', 'authService', 'appConstantPath', 'svcStorage', 'environments', 'externalLinks',
            function ($window, $location, authenticationFactory, authService,  appConstantPath, svcStorage, environments, externalLinks) {
                return {
                    restrict: 'AE',
                    templateUrl: appConstantPath.header.templateUrl,
                    link: function (scope, element, attr, ctrl, transclude) {
                        scope.environments = environments;
                        var logoutUser = function () {
                            scope.menuItems = [];
                            scope.disabledItems = [];
                            scope.loginActive = false;
                            scope.user = '';
                            svcStorage.removeAll();
                            window.localStorage.clear();
                            authService.logout();
                        };
                        //var alertData;
                        var enableUserOptions = function () {
                            scope.loginActive = authenticationFactory.isLogged;
                            if (authenticationFactory.isLogged) {
                                scope.menuItems = [
                                    { text: 'Home', routePath: 'home', base: '/home', css: '', target: '_self', isDisabled: false, displayToUi:true,isExternal: false},
                                    { text: 'Applications', routePath: 'applications', base: '/applications', css: '', target: '_self', isDisabled: false, displayToUi: true,isExternal: false },
                                    { text: 'MCPs', routePath: 'mcps', base: '/mcps', css: '', target: '_self', isDisabled: false, displayToUi:true,isExternal: false },
                                    { text: 'LOBs', routePath: 'lobs', base: '/lobs', css: '', target: '_self', isDisabled: false, displayToUi:true,isExternal: false },
                                    { text: 'Infrastructure', routePath: 'infrastructure', base: '/infrastructure', css: '', target: '_self', isDisabled: false, displayToUi:true,isExternal: false },
                                    { text: 'BCA Inventory', routePath: 'sites', base: '/sites', css: 'hidden-xs', target: '_self', isDisabled: false, displayToUi: ($.inArray(authenticationFactory.userRoles.nercCip, authenticationFactory.userRole) !== -1),isExternal: false }
                                ];
                                _.each(externalLinks, function(link, index){
                                    if(link.active) {
                                        var object = {};
                                        for(var i = 0; i < link.params.length; i++){
                                            object[link.params[i]] =  typeof authenticationFactory[link.params[i]] == 'object' ? authenticationFactory[link.params[i]].join(): authenticationFactory[link.params[i]];
                                            object[link.params[i]] = link.params[i]=="token" ? authenticationFactory.getAuthToken() : object[link.params[i]];
                                        }
                                        /*var navigateUrl = link.url + "?" + $.param(object);*/
                                        scope.menuItems.push({
                                            text: link.label,
                                            routePath: link.url,
                                            routeParams: link.method === 'GET'? "?" + $.param(object): link.params,
                                            target: '_blank',
                                            isDisabled: false,
                                            displayToUi: link.roles && link.roles.length > 0 ? _.intersection(link.roles, authenticationFactory.userRole).length > 0 : true,
                                            isExternal: true,
                                            method: link.method
                                        });
                                    }
                                });
                                scope.user = $window.localStorage.user;
                                //scope.fullName = $window.localStorage.fullName;
                            }
                            else {
                                logoutUser();
                            }
                        };
                        enableUserOptions();

                        scope.routeChange = function (item) {
                            $location.path('/' + item.routePath);
                        };

                        scope.logout = function () {
                            logoutUser();
                        };

                        scope.isAdmin = $.inArray(authenticationFactory.userRoles.admin, authenticationFactory.userRole) !== -1;
                        scope.isNercCip = $.inArray(authenticationFactory.userRoles.nercCip, authenticationFactory.userRole) !== -1;
                        scope.isActive = function (location) {
                            return $location.path().indexOf(location) != -1;
                            //return (location==$location.path());
                        };
                        //var showAlert = authenticationFactory.getAlert();
                        //scope.showAlert = (showAlert == "true") ? true: false;
                        scope.showAlert = false;
                        /*scope.hideAlert = function(){
                            authenticationFactory.removeAlert();
                        }*/
                        scope.navigateWithPost = function(menu){
                            var $form = $(document.createElement('form')).css({display:'none'}).attr("method","POST").attr('target','_blank').attr("action",menu.routePath);
                            _.each(menu.routeParams, function(param, index){
                                if(typeof authenticationFactory[param] == 'object') {
                                    $form.append($(document.createElement('input')).attr('name', param).val(authenticationFactory[param].join()));
                                }else if(param === 'token'){
                                    $form.append($(document.createElement('input')).attr('name',param).val(authenticationFactory.getAuthToken()));
                                }else{
                                    $form.append($(document.createElement('input')).attr('name',param).val(authenticationFactory[param]));
                                }
                            });
                            $("body").append($form);
                            $form.submit();
                        }
                    }
                }
            }]);
    });
})();
