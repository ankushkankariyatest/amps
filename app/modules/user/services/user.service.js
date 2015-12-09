(function () {
    "use strict";
    define(['assetIt', 'ajax-service'], function (app) {
        app.register.factory("userService", ["ajaxService",
            function (ajaxService) {
                return{
                    getUserList: function (successFn) {
                        var request = { method: 'GET', url: 'users' };
                        ajaxService.httpAuthGet(request)
                        .then(function (response) {
                            successFn(response.users);
                        });
                    },
                    updateUserList: function (userData, successFn) {
                        var request = { method: 'PUT', url: 'users', data: userData };
                        ajaxService.httpAuthPut(request)
                        .then(function (response) {
                                successFn();
                        });
                    }
                }
            }]);
    });
})();

