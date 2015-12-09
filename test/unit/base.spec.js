(function () {
    define(['angularAMD', 'angularMocks', 'assetIt'], function (angularAMD, mock, app) {
        describe('base.js', function () {
            it('angularAMD should be defined', function () {
                expect(angularAMD).toBeDefined();
            });

            it('angular app should register with the name : mainModule', function () {
                expect(app.name).toEqual("mainModule");
            });

            it('angular app should have its required dependent modules', function () {
                var appRequiredModules = [
                   'ngRoute',
                   'ngSanitize',
                   'ui.bootstrap',
                   'assetStorage',
                   "bootstrap-popup",
                   "assetItAuthentication"
                ];
                expect(app.requires.length).toBe(6);
                expect(app.requires).toEqual(appRequiredModules);
            });

            it('angular app should have loadingUi', function () {
                var _loadingUi = app.loadingUi;
                expect(typeof _loadingUi.start).toBe('function');
                expect(typeof _loadingUi.stop).toBe('function');
            });

            describe('should have factory : ', function () {
                var idleLogout;
                beforeEach(angular.mock.module(app.name));

                beforeEach(inject(function (_idleLogout_) {
                    idleLogout = _idleLogout_;
                }));

                it('idleLogout', function () {
                    expect(typeof idleLogout).toBe('function');
                });
            });
        });
    });
}());