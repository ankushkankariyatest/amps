(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.factory('infrastructureModel', function ($compile) {
            var _infrastructure = {};
            _infrastructure.tabsList = function () {
                var allTabs = [
                    { type: "server", label: 'Server', id: 'Tab1', contentUrl: 'app/modules/infra/templates/infrastructure-server.html'},
                    { type: 'database', label: 'Database', id: 'Tab2', contentUrl: 'app/modules/infra/templates/infrastructure-database.html'},
                    { type: 'middleware', label: 'Middleware', id: 'Tab3', contentUrl: 'app/modules/infra/templates/infrastructure-middleware.html' }
                ];
                return allTabs;
            }

            return _infrastructure;
        });
    });
})();