//define(['assetIt', 'jquery'], function (app, $) {
//    describe('validations factory ::', function () {
//        var validations;
//        beforeEach(module('assetIt'));
//        beforeEach(inject(function (_Person_) {
//            validations = _Person_;
//        }));

//        describe('Constructor', function () {
//            it('assigns a name', function () {
//                expect(new validations('Ben')).to.have.property('name', 'Ben');
//            });
//        });
//    });
//});'angular-mocks', mocks
//define(['angularAMD', 'assetIt'], function (angularAMD, app) {

//    describe('app.js', function () {
//        var service;
//        it('angular app should be defined', function () {
//            expect(app.name).toEqual(app.name);
//        });

//        });

//        });
define(['angularAMD', 'assetIt'], function (angularAMD, app) {

    describe('app.js', function () {
        var service;
        var v = angular.module(app.name);
          
        it('angularAMD should be defined', function () {
           
            expect(angularAMD).toBeDefined();
        });

        it('angular app should be defined', function () {
            expect(app.name).toEqual("mainModule");
        });

    });

});