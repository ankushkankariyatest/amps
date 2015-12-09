/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 4:27 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt', 'pnotify'], function (app) {
        app.register.factory("notifyService", function () {
            var myStack = { "dir1": "down", "dir2": "right", "push": "top" };
            var pines = {};
            pines.notify = function () {
                new PNotify({
                    title: 'Sticky Notice',
                    text: 'Check me out! I\'m a sticky notice. You\'ll have to close me yourself.',
                    hide: false
                });
            };
            pines.notifySuccess = function (opts) {
                if(!opts) {
                    new PNotify({
                        title: 'Sticky Success',
                        text: 'Sticky success... I\'m not even gonna make a joke.',
                        type: 'success',
                        hide: false
                    });
                }else{
                    new PNotify(opts);
                }
            };
            pines.notifyInfo = function (info) {
                new PNotify({
                    title: 'Notify user',
                    text: info.message,
                    type: 'info',
                    delay: 3000
                });
            };
            pines.notifyError = function (xhr, status, error, exception) {
               var _error = (null!=xhr && xhr.ErrorKey) ? xhr.ErrorKey:'';
                var statusErrorMap = {
                    '400': "Server understood the request, but request content was invalid. \n" + _error,
                    '403': "Unauthorized access.",
                    '404': "Resource not found.",
                    '500': "Internal server error.",
                    '503': "Service unavailable."
                };

                var exceptionErrorMap = {
                    'parsererror': "Error.\nParsing JSON Request failed.",
                    'timeout': "Request Time out.",
                    'abort': "Request was aborted by the server"
                };

                var message;
                if (status) {
                    message = statusErrorMap[status];
                } else if (exception) {
                    message = exceptionErrorMap[exception];
                }
                if (!message) {
                    message = "System Error";
                }

                var opts = {
                    title: "Asset Management Platform",
                    text: message,
                    type : 'error'
                };
                PNotify.removeAll();
                if(status !== 403) // We are performing auto-redirect to login
                    new PNotify(opts);
                /*new PNotify({
                    title: '',
                    text: message,
                    type: 'error',
                    hide: true,
                    buttons: {
                        closer: true, // Only show the closer button on hover.
                        labels: {
                            close: "Close",
                            stick: "Stick"
                        }
                    }
                });*/
            };
            return pines;
        });
    });
})();
