!function(){"use strict";define(["assetIt","auth-model","auth-formValidator","auth-service"],function(e){e.register.controller("registerController",["$scope","registerModel","authFormValidator","authService",function(e,r,i,t){e.initializeController=function(){e.userInfo=r.initializeModel(),e.showenterprise=!1,e.error=""};var o=function(r){e.request=r,e.error=""};e.registerUser=function(){e.error="",e.request="",r.updateModel(e.userInfo);var s=i.isValidRegisterForm();s.isValid?(t.register(o),e.userInfo=r.initializeModel()):(e.error=s,"$apply"!=e.$root.$$phase&&"$digest"!=e.$root.$$phase&&e.$apply())}}])})}();