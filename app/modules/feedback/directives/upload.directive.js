/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";
    define(['assetIt'], function (app) {
        app.register.directive('fileUpload', ['$parse', function ($parse) {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    link: function (scope, element, attrs, ngModel) {
                        var model = $parse(attrs.fileUpload);
                        var modelSetter = model.assign;
                        var fileType = /image.*/;
                        element.bind('change', function () {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var response = {};
                                if (!element[0].files[0].type.match(fileType)) {
                                    response.success = false;
                                    response.msg = "Only image files are supported.";
                                } else {
                                    response.success = true;
                                    response.src = reader.result;
                                    response.name = element[0].files[0].name;
                                }
                                scope.$apply(function () {
                                    ngModel.$setViewValue(response);
                                });

                            }
                            reader.readAsDataURL(element[0].files[0]);


                        });
                    },
                    template: 'upload',
                    replace: false
                };
            }
        ]);
    });
})();

