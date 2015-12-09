/**
 * Created by WizniDev on 8/21/2015.
 */
(function () {
    "use strict";
    define(['assetIt', 'jsondiffpatch', 'jsondiffpatch-formatters'], function (app, jsondiffpatch, formatters) {
        app.register.directive('differnceComparor', function () {
            return {
                restrict: 'AE',
                template:'hey',
                scope:{
                    prevModel:'=',
                    nextModel:'='
                },
                link: function ($scope, element, attrs, ngModel) {
                    var delta = jsondiffpatch.diff($scope.prevModel, $scope.nextModel);
                    element.html(formatters.html.format(delta, $scope.prevModel));
                },
                controller:function($scope){
                }
            };
        });
    });
})();