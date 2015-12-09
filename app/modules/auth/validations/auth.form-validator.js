/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 2:30 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 2:28 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('authValidations', function () {
            var validationMesssages = {
                isInvalidEmail: { message: "This is not a valid email address", isValid: false },
                isInvalidLanId: { message: "This is not a valid LAN ID", isValid: false },
                isInvalidEmailDomain: { message: "Only valid email addresses with domain pge.com are allowed", isValid: false },
                isEmpty: { message: "This field is required", isValid: false },
                passwordMismatch: { message: "Passwords do not match", isValid: false },
                minLength: { message: "Please enter atleast {length} characters", isValid: false },
                sameLanIdAndSupervisorId: { message: "LAN ID and Supervisor LAN ID cannot be same", isValid: false },
                defaultErrorInfo: { isValid: true, message: '' }
            };
            var authValidations = {};
            authValidations.isValidLanID = function (emailId) {
                var inEmptyEmail = this.isNotEmpty(emailId);
                if (!inEmptyEmail.isValid) {
                    return inEmptyEmail;
                } else {
                    var lanId = emailId;
                    var emailIdParts = /(.*)@(.*)/.exec(emailId);
                    if (emailIdParts && emailIdParts[2]) {
                        lanId = emailIdParts[1];
                        if (emailIdParts[2] == 'pge.com' && lanId.length == 4 && !/[^a-zA-Z0-9]/.test(lanId)) {
                            return validationMesssages.defaultErrorInfo
                        } else {
                            return validationMesssages.isInvalidLanId;
                        }
                    } else {
                        return (/[^a-zA-Z0-9]/.test(lanId) || lanId.length != 4) ? validationMesssages.isInvalidLanId : validationMesssages.defaultErrorInfo;
                    }
                }
            };
            authValidations.isValidEmail = function (email) {
                var inEmptyEmail = this.isNotEmpty(email);
                if (!inEmptyEmail.isValid) {
                    return inEmptyEmail;
                }
                //var regex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                var domainSplit = email.split('@');
                var regex = (domainSplit[1] !== undefined && (domainSplit[1].toLowerCase() === 'wizni.com')) ? /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@(wizni.com|pge.com)$/ : /^([_a-z0-9-]{4})@(pge.com)$/;
                //var regex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@pge.com$/;
                return (regex.test(email)) ? validationMesssages.defaultErrorInfo : validationMesssages.isInvalidEmailDomain;
            },
                    authValidations.isNotEmpty = function (data) {
                        return (data !== undefined && String(data).trim() !== '') ? validationMesssages.defaultErrorInfo : validationMesssages.isEmpty;
                    },
                    authValidations.isPasswordMismatch = function (value1, value2) {
                        return (value1 !== undefined && value2 !== undefined && value1 === value2) ? validationMesssages.defaultErrorInfo : validationMesssages.passwordMismatch;
                    },
                    authValidations.minLength = function (value, length) {
                        var minLengthMessage = validationMesssages.minLength;
                        minLengthMessage.message = String(minLengthMessage.message).replace("{length}", length);
                        return (String(value).length >= length) ? validationMesssages.defaultErrorInfo : validationMesssages.minLength;
                    }
            authValidations.isValidPassword = function (password) {
                var emptyPasswordInfo = this.isNotEmpty(password);
                return !emptyPasswordInfo.isValid ? emptyPasswordInfo : this.minLength(password, 5);
            }

            authValidations.isValidSupervisorLanID = function (emailId, supervisorLanId) {
                var inEmptyEmail = this.isNotEmpty(supervisorLanId);
                if (!inEmptyEmail.isValid) {
                    return inEmptyEmail;
                }

                if (emailId === supervisorLanId) {
                   return validationMesssages.sameLanIdAndSupervisorId;
                }

                var lanId = supervisorLanId;
                var emailIdParts = /(.*)@(.*)/.exec(supervisorLanId);
                if (emailIdParts && emailIdParts[2]) {
                    lanId = emailIdParts[1];
                    if (emailIdParts[2] == 'pge.com' && lanId.length == 4 && !/[^a-zA-Z0-9]/.test(lanId)) {
                        return validationMesssages.defaultErrorInfo
                    } else {
                        return validationMesssages.isInvalidLanId;
                    }
                }
                else {
                    return (/[^a-zA-Z0-9]/.test(lanId) || lanId.length != 4) ? validationMesssages.isInvalidLanId : validationMesssages.defaultErrorInfo;
                }

            };

            return authValidations;
        });

        app.register.factory('authFormValidator', ['authValidations', 'loginModel', 'registerModel', 'forgotPasswordModel', 'resetPasswordModel', function (validations, loginModel, registerModel, forgotPasswordModel, resetPasswordModel) {

            var _defaultErrorInfo = { isValid: true, message: '' };

            var loginDefaultError = {
                isValid: true,
                username: _defaultErrorInfo,
                password: _defaultErrorInfo
            };

            var registerDefaultError = {
                isValid: true,
                username: _defaultErrorInfo,
                password: _defaultErrorInfo,
                cnf_password: _defaultErrorInfo,
                fullName: _defaultErrorInfo,
                companyName: _defaultErrorInfo
            };

            var forgotPasswordDefaultError = {
                isValid: true,
                username: _defaultErrorInfo
            };

            var resetPasswordDefaultError = {
                isValid: true,
                password: _defaultErrorInfo,
                cnf_password: _defaultErrorInfo
            }

            var defaultError = function () {
                return {
                    loginError: {
                        username: validationMesssages.defaultErrorInfo,
                        password: validationMesssages.defaultErrorInfo
                    },
                    registerError: {
                        username: validationMesssages.defaultErrorInfo,
                        password: validationMesssages.defaultErrorInfo,
                        cnf_password: validationMesssages.defaultErrorInfo,
                        fullName: validationMesssages.defaultErrorInfo,
                        companyName: validationMesssages.defaultErrorInfo
                    },
                    resetPasswordError: {
                        password: validationMesssages.defaultErrorInfo,
                        cnf_password: validationMesssages.defaultErrorInfo
                    },
                    forgotPasswordError: {
                        username: validationMesssages.defaultErrorInfo
                    },
                    feedbackError: {
                        email: validationMesssages.defaultErrorInfo,
                        mood: validationMesssages.defaultErrorInfo,
                        subject: validationMesssages.defaultErrorInfo,
                        message: validationMesssages.defaultErrorInfo
                    }
                }
            };
            var validateForms = {};
            validateForms.isValidLoginForm = function () {
                var username = loginModel.getUsername();
                var password = loginModel.getPassword();

                var formInfo = angular.extend({}, loginDefaultError);

                var invalidEmail = validations.isValidLanID(username);
                formInfo.username = invalidEmail;
                formInfo.isValid = (!invalidEmail.isValid) ? invalidEmail.isValid : formInfo.isValid;

                var isPasswordEmpty = validations.isValidPassword(password);
                formInfo.password = isPasswordEmpty;
                formInfo.isValid = (!isPasswordEmpty.isValid) ? isPasswordEmpty.isValid : formInfo.isValid;
                return formInfo;
            }
            validateForms.isValidRegisterForm = function () {

                var username = registerModel.getUsername();
                var password = registerModel.getPassword();
                var supervisorLanId = registerModel.getSupervisorLanId();
                var requestEnterprise = registerModel.getRequestEnterprise();
                var businessJustification = registerModel.getBusinessJustification();

                var formInfo = angular.extend({}, registerDefaultError);

                var invalidEmail = validations.isValidLanID(username);
                formInfo.username = invalidEmail;
                formInfo.isValid = (!invalidEmail.isValid) ? invalidEmail.isValid : formInfo.isValid;

                var isPasswordEmpty = validations.isValidPassword(password);
                formInfo.password = isPasswordEmpty;
                formInfo.isValid = (!isPasswordEmpty.isValid) ? isPasswordEmpty.isValid : formInfo.isValid;

                var invalidSupervisorLanId = validations.isValidSupervisorLanID(username, supervisorLanId);
                formInfo.supervisorLanId = invalidSupervisorLanId;
                formInfo.isValid = (!invalidSupervisorLanId.isValid) ? invalidSupervisorLanId.isValid : formInfo.isValid;

                //if (requestEnterprise == 1) {
                var invalidBusinessJustification = validations.isNotEmpty(businessJustification);
                formInfo.businessJustification = invalidBusinessJustification;
                formInfo.isValid = (!invalidBusinessJustification.isValid) ? invalidBusinessJustification.isValid : formInfo.isValid;
                //}
                return formInfo;
            }

            validateForms.isValidForgotPasswordForm = function () {
                var username = forgotPasswordModel.getUsername();

                var formInfo = angular.extend({}, forgotPasswordDefaultError);

                var invalidEmail = validations.isValidEmail(username);
                formInfo.username = invalidEmail;
                formInfo.isValid = (!invalidEmail.isValid) ? invalidEmail.isValid : formInfo.isValid;

                return formInfo;
            }
            validateForms.isValidResetPasswordForm = function () {
                var password = resetPasswordModel.getPassword();
                var confPassword = resetPasswordModel.getCnfPassword();

                var formInfo = angular.extend({}, resetPasswordDefaultError);

                var isPasswordEmpty = validations.isValidPassword(password);
                formInfo.password = isPasswordEmpty;
                formInfo.isValid = (!isPasswordEmpty.isValid) ? isPasswordEmpty.isValid : formInfo.isValid;

                var isConfPasswordValid = validations.isValidPassword(confPassword);
                formInfo.cnf_password = isConfPasswordValid;
                formInfo.isValid = (!isConfPasswordValid.isValid) ? isConfPasswordValid.isValid : formInfo.isValid;

                if (isConfPasswordValid.isValid) {
                    var isConfPasswordValid = validations.isPasswordMismatch(password, confPassword);
                    formInfo.cnf_password = isConfPasswordValid;
                    formInfo.isValid = (!isConfPasswordValid.isValid) ? isConfPasswordValid.isValid : formInfo.isValid;
                }

                return formInfo;
            }

            return {
                errorInfo: defaultError,
                isValidLoginForm: validateForms.isValidLoginForm,
                isValidRegisterForm: validateForms.isValidRegisterForm,
                isValidResetPasswordForm: validateForms.isValidResetPasswordForm,
                isValidForgotPasswordForm: validateForms.isValidForgotPasswordForm
            }
        }]);
    });
})();