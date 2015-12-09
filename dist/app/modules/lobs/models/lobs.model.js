!function(){"use strict";define(["assetIt"],function(e){e.register.factory("lobsConfig",["isMobileView","authenticationFactory",function(a,t){var e={},i=/[^a-zA-Z0-9]/g;return e.getConfigs=function(){var e={};return e.dataSource={data:[],schema:{model:{id:"LOB_NAME",fields:{LOB_NAME:{editable:!1,type:"string"},COUNT:{editable:!1},DESCRIPTION:{editable:!0,type:"string",validation:{notempty:function(e){var t={DESCRIPTION:"description can not be empty"};return e.attr("data-notempty-msg",t[e.attr("name")]),""==String(e.val()).trim()?!1:!0}}}}}},pageSize:20,sort:{field:"LOB_NAME",dir:"asc"}},e.columns=[{field:"LOB_NAME",title:"LOB Name",width:350,template:function(e){var t=null!=e.LOB_NAME?e.LOB_NAME:"";return'<span class="info">'+t+'</span><a class="permalink-wrapper" style="display:none;" attr-base="lobs" attr-permalink-key="'+e.LOB_NAME+'"><span class="icon-link"></span></a>'}},{field:"DESCRIPTION",title:"Description",editor:function(t,e){$('<textarea data-bind="value:'+e.field+'" name="'+e.field+'" rows="5" cols="42"></textarea>').appendTo(t)}},{field:"COUNT",title:"Feedback",width:90,template:function(e){return'<span class="comment_count '+(e.COUNT?"":"hide")+'"><i class="icon-caret-down"></i> <span class="feedbackCount'+e.LOB_NAME.replace(i,"_")+'">'+e.COUNT+"</span></span>"}},{title:"Actions",command:"edit",name:"",className:"glyphicon glyphicon-edit",width:100,hidden:-1==t.userRole.indexOf(t.userRoles.admin)}],e.routeParamFilter=function(e){return{field:"LOB_NAME",operator:"eq",value:e}},e.getDefaultFilterWithFilterText=function(i){var e=i,t={logic:"or",filters:[{field:"LOB_NAME",operator:"contains",value:e},{field:"DESCRIPTION",operator:"contains",value:e}]};return a&&(t.filters=[{field:"LOB_NAME",operator:"contains",value:e}]),t},e},e.getSubGridConfigs=function(){var e=new kendo.data.DataSource({data:[],schema:{model:{id:"APP_ID",fields:{APP_ID:{type:"number"},SERVICE_OR_APPLICATION_NAME:{type:"string"}}}},pageSize:10,sort:{field:"APP_ID",dir:"asc"}});return{dataSource:e,columns:[{field:"APP_ID",title:"Applications ID",width:120,template:function(e){return'<a href="#applications/'+e.APP_ID+'">'+e.APP_ID+"</a>"}},{field:"SERVICE_OR_APPLICATION_NAME",title:"Applications Name"},{field:"STATUS",title:"Status"}],resizable:!1,scrollable:!1,sortable:{mode:"single",allowUnsort:!1},pageable:{pageSize:10,numeric:!1,input:!0,pageSizes:[10,20,30,40,50,60,70,80],refresh:!1}}},e}])})}();