!function(){"use strict";define(["assetIt","jsondiffpatch","jsondiffpatch-formatters"],function(e,t,o){e.register.directive("differnceComparor",function(){return{restrict:"AE",template:"hey",scope:{prevModel:"=",nextModel:"="},link:function(e,r,f,i){var n=t.diff(e.prevModel,e.nextModel);r.html(o.html.format(n,e.prevModel))},controller:["$scope",function(e){}]}})})}();