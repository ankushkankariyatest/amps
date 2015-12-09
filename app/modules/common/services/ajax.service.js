/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 01/03/15
 * Time: 8:36 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define(['assetIt', 'notify-service'], function (app) {
        app.register.service('ajaxService', ['$http', '$q', '$timeout', 'svcStorage', 'configUrl', 'loadingData', 'notifyService',
            function ($http, $q, $timeout, svcStorage, configUrl, loadingData, notifyService) {
                var sendEmail = function(req, res){
                    if(configUrl.sendErrorInMail) {
                        var params = {
                            "from": "am4it@wizni.com",
                            "to": configUrl.errorEmailReceipient,
                            "subject": "AMPS Front End Error",
                            "html": "Request <br />"+JSON.stringify(req)+"<br /><br/>Response <br />"+JSON.stringify(res)
                        };
                        $http({
                            url: configUrl.baseServiceUrl+"sendemail",
                            method: 'POST',
                            data: params
                        }).then();
                    }
                };
                this.httpPost = function (request, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    request.url = configUrl.baseServiceUrl + request.url;
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingData.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop(); //hide loader
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                }
                this.httpSimulatePost = function (request, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    //request.url = configUrl.baseServiceUrl + request.url;
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingData.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop(); //hide loader
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                }

                this.httpGet = function (request, route, successFunction, errorFunction) {

                    request.url = configUrl.baseServiceUrl + request.url;
                    request.cache = false;

                    var cacheKey = request.url;
                    var appCache = svcStorage.get(cacheKey);

                    var deferred = $q.defer();
                    if (appCache) {
                        deferred.resolve(appCache);
                    }
                    else {
                        loadingData.start(); // Show Loader
                        $http(request).success(function (response) {
                            loadingData.stop(); //hide loader
                            svcStorage.put(cacheKey, response);
                            deferred.resolve(response);
                        }).error(function (xhr, status, error, exception) {
                            loadingData.stop(); //hide loader
                            sendEmail(request, xhr);
                            notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                            deferred.reject(xhr);
                        });
                    }
                    return deferred.promise;
                }

                this.httpPut = function (request, route, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    request.url = configUrl.baseServiceUrl + request.url;
                    request.cache = false;
                    var deferred = $q.defer();

                    $http(request).success(function (response) {
                        loadingData.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop(); //hide loader
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                }

                this.httpAuthGet = function (request, successFunction, errorFunction) {
                    request.url = configUrl.secureUrl + request.url;
                    request.cache = false;
                    var cacheKey = request.url;
                    var appCache = svcStorage.get(cacheKey);

                    var deferred = $q.defer();
                    if (appCache) {
                        deferred.resolve(appCache);
                    }
                    else {
                        loadingData.start(); // Show Loader
                        $http(request)
                                .success(function (response) {
                                    loadingData.stop(); //hide loader
                                    svcStorage.put(cacheKey, response);
                                    deferred.resolve(response);
                                })
                                .error(function (xhr, status, error, exception) {
                                    loadingData.stop(); //hide loader
                                    sendEmail(request, xhr);
                                    notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                                    deferred.reject(xhr);
                                });
                    }
                    return deferred.promise;
                }

                this.httpAuthPut = function (request, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    request.url = configUrl.secureUrl + request.url;
                    request.cache = false;
                    var deferred = $q.defer();

                    $http(request)
                            .success(function (response) {
                                loadingData.stop(); //hide loader
                                deferred.resolve(response);
                            })
                            .error(function (xhr, status, error, exception) {
                                loadingData.stop(); //hide loader
                                sendEmail(request, xhr);
                                notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                                deferred.reject(xhr);
                            });
                    return deferred.promise;
                }

                this.httpSimulateGet = function (request, route, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    var deferred = $q.defer();
                    request.params = request.params?request.params:{};
                    request.params['time'] = Date.now();
                    $http(request).success(function (response) {
                        loadingData.stop(); //hide loader
                        if (response.isSuccess) {
                            deferred.resolve(response);
                        } else {
                            //notifyService.notifyInfo(response);
                            deferred.resolve(response);
                        }
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop(); //hide loader
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception); // Error notification on page when error
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                }

                this.httpParrallelGet = function (reqApis) {
                    var arr = [];
                    var _respKeyAsReqUrl = {};

                    angular.forEach(reqApis.requests, function (item, index) {
                        _respKeyAsReqUrl[index] = item.url;
                        var req = item;
                        req.url = configUrl.baseServiceUrl + req.url;
                        req.cache = false;
                    });

                    var appCache = svcStorage.get(reqApis.serviceName);
                    var fetchDataFromSvc = (appCache) ? false : true;


                    var deferred = $q.defer();
                    if (!fetchDataFromSvc) {
                        _respKeyAsReqUrl = svcStorage.get(reqApis.serviceName);
                        deferred.resolve(_respKeyAsReqUrl);
                    }
                    else {
                        angular.forEach(reqApis.requests, function (req, index) {
                            arr.push($http(req));
                        });
                        loadingData.start(); // Show Loader
                        $q.all(arr).then(function (respArray) {
                            loadingData.stop(); //hide loader
                            angular.forEach(reqApis.requests, function (item, index) {
                                _respKeyAsReqUrl[index] = respArray[index].data;
                            });
                            svcStorage.put(reqApis.serviceName, _respKeyAsReqUrl);
                            deferred.resolve(_respKeyAsReqUrl);
                        }, function (xhr) {
                            loadingData.stop();
                            sendEmail(reqApis.requests, xhr);
                            notifyService.notifyError(xhr.data, xhr.status, undefined, xhr.statusText);  // Error notification on page when error
                            deferred.reject(xhr);
                        });
                    }
                    return deferred.promise;
                }

                this.http = function (request) {
                    request.url = configUrl.baseServiceUrl + request.url;
                    request.cache = false;
                    loadingData.start();
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingData.stop();
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop();
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                }

                this.httpAlwaysServerGet = function (request, route, successFunction, errorFunction) {
                    loadingData.start(); // Show Loader
                    request.url = configUrl.baseServiceUrl + request.url;
                    request.cache = false;
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        loadingData.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        loadingData.stop(); //hide loader
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);  // Error notification on page when error
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                }

                this.httpAsyncSimulateGet = function (request, route, successFunction, errorFunction) {
                    var deferred = $q.defer();
                    //request.params = request.params ? request.params:{};
                    $http(request).success(function (response) {
                        if (response.isSuccess) {
                            deferred.resolve(response);
                        } else {
                            deferred.resolve(response);
                        }
                    }).error(function (xhr, status, error, exception) {
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception); // Error notification on page when error
                        deferred.reject(xhr);
                    });

                    return deferred.promise;
                };

                this.httpAsyncSimulatePost = function (request, successFunction, errorFunction) {
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        sendEmail(request, xhr);
                        notifyService.notifyError(xhr, status, error, exception);
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                };
            }]);
    });
})();