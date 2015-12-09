/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 04/03/15
 * Time: 3:31 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        var app = angular.module('assetStorage', []);
        app.factory('svcStorage', ['$cacheFactory', '$window', function ($cacheFactory, $window) {
            var cacheFactory = $cacheFactory('cache');
            var cache = {
                put: function (key, value) {
                    cacheFactory.put(key, value);
                    //$window.localStorage[key] = value;
                },
                get: function (key) {
                    //return $window.localStorage[key];
                    //var data = cacheFactory.get(key);
                    //if (!data) {
                    //    data = $window.localStorage[key];
                    //}
                    return false;
                },
                remove: function (key) {
                    cacheFactory.remove(key);
                    //$window.localStorage[key] = ''
                },
                removeAll: function () {
                    cacheFactory.removeAll();
                    //$window.localStorage.$reset();
                },
                destroy: function () {
                    cacheFactory.info();
                    //$window.localStorage.$reset();
                }
            };
            return cache;
        }])
    });
})();