/**
 * Created by wizdev on 7/27/2015.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('infrastructureModel', function ($compile) {
            var _enterprise = {};
            _enterprise.dataList = function () {
                var allData = [];
                return allData;
            }

            return _enterprise;
        });
    });
})();