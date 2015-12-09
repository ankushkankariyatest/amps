/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

!function(){"use strict";define(["assetIt"],function(e){e.register.directive("fileUpload",["$parse",function(e){return{restrict:"A",require:"?ngModel",link:function(n,i,a,s){var t=e(a.fileUpload),r=(t.assign,/image.*/);i.bind("change",function(){var e=new FileReader;e.onload=function(t){var a={};i[0].files[0].type.match(r)?(a.success=!0,a.src=e.result,a.name=i[0].files[0].name):(a.success=!1,a.msg="Only image files are supported."),n.$apply(function(){s.$setViewValue(a)})},e.readAsDataURL(i[0].files[0])})},template:"upload",replace:!1}}])})}();