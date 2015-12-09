/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 03/03/15
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
(function(){
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('validations', function() {
            var validationMesssages = {
                isInvalidEmail: { message: "This is not a valid email address", isValid: false },
                isInvalidEmailDomain: {message :"Only Email Addresses with domain pge.com are allowed", isValid: false},
                isEmpty: {message:"This field is required", isValid: false},
                passwordMismatch: {message:"Passwords do not match", isValid: false},
                minLength: {message:"Please enter atleast {length} characters", isValid: false},
                defaultErrorInfo: {isValid: true, message: ''}
            };
            var authValidations = {};
            authValidations.isValidEmail = function(email) {
                var inEmptyEmail =  this.isNotEmpty(email);
                if(!inEmptyEmail.isValid){
                    return inEmptyEmail;
                }
                //var regex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                var regex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@(wizni.com|pge.com)$/;
                //var regex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@pge.com$/;
                return (regex.test(email))?validationMesssages.defaultErrorInfo:validationMesssages.isInvalidEmailDomain;
            },
                authValidations.isNotEmpty = function(data) {
                    return (data !== undefined && String(data).trim() !== '')?validationMesssages.defaultErrorInfo:validationMesssages.isEmpty;
                },
                authValidations.isPasswordMismatch = function(value1, value2) {
                    return (value1 !== undefined && value2 !== undefined && value1 === value2)?validationMesssages.defaultErrorInfo:validationMesssages.passwordMismatch;
                },
                authValidations.minLength = function(value, length) {
                    var minLengthMessage = validationMesssages.minLength;
                    minLengthMessage.message = String(minLengthMessage.message).replace("{length}", length);
                    return (String(value).length >= length) ?validationMesssages.defaultErrorInfo:validationMesssages.minLength;
                }
            return authValidations;
        });
    });
})();
