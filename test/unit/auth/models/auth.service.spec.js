define(['angularAMD', 'angularMocks', 'assetIt'], function (angularAMD, mock, app) {
    describe('auth.service.js', function () {
        app.constant('userRoles', {
            "admin": 1,
            "nercCip": 2,
            "enterprise": 3
        });
        app.constant('configUrl', {
            "authServiceUrl": "http://162.243.159.42:1338/",
            "baseServiceUrl": "http://appmap.wizeapi.com/api/",
            "simulateServiceUrl": "http://appmap.wize.me/api/test/",
            "infraSimulate": false
        });
        app.constant('configOptions', {
            "frontEndVersion": "2.0"
        });
        app.constant("autoLogOutMinutes", 30);
        angularAMD.bootstrap(app);

        var loginModel, httpBackend;
        beforeEach(angular.mock.module('assetItAuthentication'));
        //mock Application to allow us to inject our own dependencies
       // beforeEach(angular.mock.module(app.name));

        beforeEach(inject(function (_loginModel_, _registerModel_, _forgotPasswordModel_, _resetPasswordModel_) {
            loginModel = _loginModel_;
            registerModel = _registerModel_;
            forgotPasswordModel = _forgotPasswordModel_;
            resetPasswordModel = _resetPasswordModel_;
        }));

        it('should have factory : loginModel', function () {

            expect(typeof loginModel.initializeModel).toBe('function');
            expect(typeof loginModel.getModel).toBe('function');
            expect(typeof loginModel.updateModel).toBe('function');
            expect(typeof loginModel.getUsername).toBe('function');
            expect(typeof loginModel.getPassword).toBe('function');

            expect(loginModel).toBeDefined();
            expect(loginModel.initializeModel()).toBeDefined();
            expect(loginModel.getModel()).toBeDefined();
            //expect(loginModel.updateModel()).toBeDefined();
            expect(loginModel.getUsername()).toBeDefined();
            expect(loginModel.getPassword()).toBeDefined();
        });

        it('should have factory : registerModel', function () {

            expect(typeof registerModel.initializeModel).toBe('function');
            expect(typeof registerModel.getModel).toBe('function');
            expect(typeof registerModel.updateModel).toBe('function');
            expect(typeof registerModel.getUsername).toBe('function');
            expect(typeof registerModel.getFullName).toBe('function');
            expect(typeof registerModel.getCompanyName).toBe('function');
            expect(typeof registerModel.getPassword).toBe('function');
            expect(typeof registerModel.getCnfPassword).toBe('function');

            expect(registerModel).toBeDefined();
            expect(registerModel.initializeModel()).toBeDefined();
            expect(registerModel.getModel()).toBeDefined();
           // expect(registerModel.updateModel()).toBeDefined();
            expect(registerModel.getUsername()).toBeDefined();
            expect(registerModel.getFullName()).toBeDefined();
            expect(registerModel.getPassword()).toBeDefined();
        });

        it('should have factory : forgotPasswordModel', function () {
            expect(typeof forgotPasswordModel.initializeModel).toBe('function');
            expect(typeof forgotPasswordModel.getModel).toBe('function');
            expect(typeof forgotPasswordModel.updateModel).toBe('function');
            expect(typeof forgotPasswordModel.getUsername).toBe('function');

            expect(forgotPasswordModel).toBeDefined();
            expect(forgotPasswordModel.initializeModel()).toBeDefined();
            expect(forgotPasswordModel.getModel()).toBeDefined();
            //expect(forgotPasswordModel.updateModel()).toBeDefined();
            expect(forgotPasswordModel.getUsername()).toBeDefined();
        });

        it('should have factory : resetPasswordModel', function () {
            expect(typeof resetPasswordModel.initializeModel).toBe('function');
            expect(typeof resetPasswordModel.getModel).toBe('function');
            expect(typeof resetPasswordModel.updateModel).toBe('function');
            expect(typeof resetPasswordModel.getPassword).toBe('function');
            expect(typeof resetPasswordModel.getCnfPassword).toBe('function');

            expect(resetPasswordModel).toBeDefined();
            expect(resetPasswordModel.initializeModel()).toBeDefined();
            expect(resetPasswordModel.getModel()).toBeDefined();
            //expect(resetPasswordModel.updateModel()).toBeDefined();
            expect(resetPasswordModel.getPassword()).toBeDefined();
            expect(resetPasswordModel.getCnfPassword()).toBeDefined();
        });
    });
});