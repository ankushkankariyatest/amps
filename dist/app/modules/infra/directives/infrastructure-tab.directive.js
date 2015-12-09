/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

!function(){"use strict";define(["assetIt","jquery","kendo.all.min","export-util","infrastructure-menu-service"],function(e,t){e.register.directive("infraGrid",["infrastructureService","exportUtil","$compile",function(e,i,r){return{restrict:"AE",scope:{tabname:"@"},template:'<div class="application-container"><div id="grid" class="app-table-bdr"></div></div>',link:function(i,n,m){var a,g=function(e){var t=e.xhr.message?e.xhr.message:"No Record to display";n.find("#grid tbody").html('<tr><td colspan="5"><div class="text-center">'+t+"</div></td></tr>")},y=function(e){kendo.ui.progress(s,!1),o[i.tabname].serviceName(e.data).then(function(t){if(t.isSuccess){for(var r in t.response.data)for(var i in t.response.data[r])t.response.data[r][i]=null!=t.response.data[r][i]&&"object"!=typeof t.response.data[r][i]?t.response.data[r][i]:"";e.success(t.response)}else e.error(t)})},o={server:{represetnIn:"grid",detailTemplateId:"serverTemplate",serviceName:e.getServerList,dataSource:new kendo.data.DataSource({transport:{read:y},pageSize:20,schema:{data:"data",total:"total",errors:"message",model:{fields:{AssetID:{type:"string"},Name:{type:"string"},Model:{type:"string"},firmware_version:{type:"string"},ManufacturerName:{type:"string"},RequestId:{type:"string"},Submitter:{type:"string"},CreateDate:{type:"string"},LastModifiedBy:{type:"string"},ModifiedDate:{type:"string"},AssetLifecycleStatus:{type:"string"},ShortDescription:{type:"string"},CMDBRowLevelSecurity:{type:"string"},InstanceId:{type:"string"},zTmpAppAdministratorGroupMember:{type:"string"},zTmpAppManagementGroupMember:{type:"string"},zTmpAppSupportGroupMember:{type:"string"},zTmpAdministratorGroupMember:{type:"string"},SalesTax_currencyValue:{type:"string"},SalesTax_currencyCode:{type:"string"},SalesTax_currencyConversionDate:{type:"string"},SerialNumber:{type:"string"},Category:{type:"string"},Type:{type:"string"},Item:{type:"string"},SiteGroup:{type:"string"},Region:{type:"string"},PartNumber:{type:"string"},zTmpKeyword:{type:"string"},zUpdateComponents:{type:"string"},AcquiredMethod:{type:"string"},Site:{type:"string"},CurrentState:{type:"string"},InstallationDate:{type:"string"},Y2KCompliant:{type:"string"},Supported:{type:"string"},TagNumber:{type:"string"},CostCenter:{type:"string"},OrderID:{type:"string"},BookValue_currencyValue:{type:"string"},BookValue_currencyCode:{type:"string"},BookValue_currencyConversionDate:{type:"string"},ReceivedDate:{type:"string"},FixedAsset:{type:"string"},TotalPurchaseCost_currencyValue:{type:"string"},TotalPurchaseCost_currencyCode:{type:"string"},TotalPurchaseCost_currencyConversionDate:{type:"string"},TaxCredit_currencyValue:{type:"string"},TaxCredit_currencyCode:{type:"string"},TaxCredit_currencyConversionDate:{type:"string"},UnitPrice_currencyValue:{type:"string"},UnitPrice_currencyCode:{type:"string"},UnitPrice_currencyConversionDate:{type:"string"},MarketValue_currencyValue:{type:"string"},MarketValue_currencyCode:{type:"string"},MarketValue_currencyConversionDate:{type:"string"},ScheduleType:{type:"string"},AssetClass:{type:"string"},zTmpSchemaProperName:{type:"string"},Depreciated:{type:"string"},zWhenAssetsAreDeleted:{type:"string"},ImpactComputationModel:{type:"string"},Inventory:{type:"string"},HostName:{type:"string"},PrimaryCapability:{type:"string"},SystemType:{type:"string"},AdminPasswordStatus:{type:"string"},BootROMSupported:{type:"string"},ChassisBootupState:{type:"string"},ResetCapability:{type:"string"},ThermalState:{type:"string"},Cost_currencyCode:{type:"string"},FailedAutomaticIdentification:{type:"string"},Cost_currencyValue:{type:"string"},Cost_currencyConversionDate:{type:"string"},Priority:{type:"string"},DHCPUse:{type:"string"},ClassId:{type:"string"},DatasetId:{type:"string"},MarkAsDeleted:{type:"string"},ReconciliationIdentity:{type:"string"},deleted:{type:"string"},LastREJobrunId:{type:"string"},UserDisplayObjectName:{type:"string"},TokenId:{type:"string"},VirtualSystemType:{type:"string"},Confidentiality:{type:"string"},Availability:{type:"string"},Integrity:{type:"string"},AttributeDataSourceList:{type:"string"},ReferenceInstance:{type:"string"},zCMDBEngTimestampStub:{type:"string"},NormalizationStatus:{type:"string"},isVirtual:{type:"string"},ReconciliationMergeStatus:{type:"string"},IsUnqualified:{type:"string"},ReconciliationIdType:{type:"string"},ReconciliationIdChanged:{type:"string"},ReconciliationIdentificationError:{type:"string"},SAPAssetID:{type:"string"},PublicWS:{type:"string"},NumOfCPU:{type:"string"},RecordOrigin:{type:"string"},NERCType:{type:"string"},PGEOrganization:{type:"string"},SCADASystemName:{type:"string"},WheatherCritical:{type:"string"},Criticality:{type:"string"},LastDiscoveryUpdate:{type:"string"},SAPCountyNo:{type:"string"},SOX_CI:{type:"string"},Company:{type:"string"},LocationCompany:{type:"string"},StatusReason:{type:"string"},Urgency:{type:"string"},Impact:{type:"string"}}}},data:[],serverPaging:!0,serverFiltering:!0,error:g}),columns:[{field:"Name",title:"Name"},{field:"ManufacturerName",title:"Manufacturer"},{field:"Model",title:"Model"},{field:"firmware_version",title:"Version"}],getFilter:function(e){return{logic:"or",filters:[{field:"AssetID",operator:"eq",value:parseInt(e)},{field:"Name",operator:"contains",value:e},{field:"ManufacturerName",operator:"contains",value:e},{field:"Model",operator:"contains",value:e},{field:"firmware_version",operator:"contains",value:e}]}}},database:{represetnIn:"grid",detailTemplateId:"dbTemplate",serviceName:e.getDBList,dataSource:new kendo.data.DataSource({transport:{read:y},pageSize:20,schema:{data:"data",total:"total",errors:"message",model:{fields:{Name:{type:"string"},Model:{type:"string"},firmware_version:{type:"string"},ManufacturerName:{type:"string"},RequestId:{type:"string"},Submitter:{type:"string"},CreateDate:{type:"string"},LastModifiedBy:{type:"string"},ModifiedDate:{type:"string"},AssetLifecycleStatus:{type:"string"},ShortDescription:{type:"string"},"Status-History":{type:"string"},CMDBRowLevelSecurity:{type:"string"},InstanceId:{type:"string"},zTmpAppAdministratorGroupMember:{type:"string"},zTmpAppManagementGroupMember:{type:"string"},zTmpAppSupportGroupMember:{type:"string"},zTmpAdministratorGroupMember:{type:"string"},SalesTax_currencyValue:{type:"string"},SalesTax_currencyCode:{type:"string"},SalesTax_currencyConversionDate:{type:"string"},Category:{type:"string"},Type:{type:"string"},Item:{type:"string"},zTmpKeyword:{type:"string"},zUpdateComponents:{type:"string"},VersionNumber:{type:"string"},AcquiredMethod:{type:"string"},CurrentState:{type:"string"},InstallationDate:{type:"string"},Y2KCompliant:{type:"string"},Supported:{type:"string"},CostCenter:{type:"string"},BookValue_currencyValue:{type:"string"},BookValue_currencyCode:{type:"string"},BookValue_currencyConversionDate:{type:"string"},FixedAsset:{type:"string"},TotalPurchaseCost_currencyValue:{type:"string"},TotalPurchaseCost_currencyCode:{type:"string"},TotalPurchaseCost_currencyConversionDate:{type:"string"},TaxCredit_currencyValue:{type:"string"},TaxCredit_currencyCode:{type:"string"},TaxCredit_currencyConversionDate:{type:"string"},UnitPrice_currencyValue:{type:"string"},UnitPrice_currencyCode:{type:"string"},UnitPrice_currencyConversionDate:{type:"string"},MarketValue_currencyValue:{type:"string"},MarketValue_currencyCode:{type:"string"},MarketValue_currencyConversionDate:{type:"string"},ScheduleType:{type:"string"},AssetClass:{type:"string"},zTmpSchemaProperName:{type:"string"},Depreciated:{type:"string"},zWhenAssetsAreDeleted:{type:"string"},ImpactComputationModel:{type:"string"},Inventory:{type:"string"},FailedAutomaticIdentification:{type:"string"},Cost_currencyValue:{type:"string"},Cost_currencyCode:{type:"string"},Cost_currencyConversionDate:{type:"string"},Priority:{type:"string"},ClassId:{type:"string"},DatasetId:{type:"string"},MarkAsDeleted:{type:"string"},ReconciliationIdentity:{type:"string"},deleted:{type:"string"},LastREJobrunId:{type:"string"},UserDisplayObjectName:{type:"string"},TokenId:{type:"string"},Confidentiality:{type:"string"},Availability:{type:"string"},Integrity:{type:"string"},ReferenceInstance:{type:"string"},zCMDBEngTimestampStub:{type:"string"},NormalizationStatus:{type:"string"},ReconciliationMergeStatus:{type:"string"},NEFeatureStatusMask:{type:"string"},ReconciliationIdType:{type:"string"},ReconciliationIdChanged:{type:"string"},ReconciliationIdentificationError:{type:"string"},LegacyID:{type:"string"},NERCType:{type:"string"},PGEOrganization:{type:"string"},WheatherCritical:{type:"string"},Criticality:{type:"string"},LastDiscoveryUpdate:{type:"string"},SOX_CI:{type:"string"},Company:{type:"string"},LocationCompany:{type:"string"},StatusReason:{type:"string"},Urgency:{type:"string"},Impact:{type:"string"}}}},data:[],serverPaging:!0,serverFiltering:!0,error:g}),columns:[{field:"Name",title:"Name"},{field:"ManufacturerName",title:"Manufacturer"},{field:"Model",title:"Model"},{field:"VersionNumber",title:"Version"}],getFilter:function(e){return{logic:"or",filters:[{field:"Name",operator:"contains",value:e},{field:"ManufacturerName",operator:"contains",value:e},{field:"Model",operator:"contains",value:e},{field:"VersionNumber",operator:"contains",value:e}]}}},middleware:{represetnIn:"grid",detailTemplateId:"middlewareTemplate",dataSource:new kendo.data.DataSource({pageSize:20,schema:{model:{fields:{HostName:{type:"string"},Model:{type:"string"},firmware_version:{type:"string"},ManufacturerName:{type:"string"}}}},data:[]}),columns:[{field:"HostName",title:"Host"},{field:"ManufacturerName",title:"Manufacturer"},{field:"Model",title:"Model"},{field:"VersionNumber",title:"Version"}]}},s=n.find("#grid"),p=o[i.tabname],c=function(){s.kendoGrid({dataSource:p.dataSource,autoBind:!0,filterable:{extra:!1},scrollable:!1,groupable:!1,selectable:!1,pageable:{refresh:!1,input:!0,numeric:!1,pageSize:20,pageSizes:[20,50,100,200]},columns:p.columns,resizable:!0,detailTemplate:kendo.template(t("#"+p.detailTemplateId).html()),detailInit:l,detailExpand:d}).data("kendoGrid")},l=function(e){var t=e.detailRow;t.find(".tabstrip").kendoTabStrip({animation:{open:{effects:"fadeIn"}},select:function(e){e.item.textContent.indexOf("Feedback")>-1&&r(e.contentElement)(i),"Application"==e.item.innerText&&r(e.contentElement)(i)}}),kendo.bind(t,e.data)},d=function(e){if(null!=a&&a[0]!=e.masterRow[0]){var t=s.data("kendoGrid");t.collapseRow(a)}a=e.masterRow},u=function(e){e&&e.length>0&&(n.find("#grid tbody tr.k-master-row").highlight(e),n.find("#grid tbody tr.k-detail-row div.k-content div.row div:nth-child(even)").highlight(e))};c(),n.find("#txtSearchString").bind("input propertychange",function(g){var t=this.value,p=o[i.tabname].getFilter(t),r=s.data("kendoGrid"),n=r.dataSource.filter(),e=n?n:{filters:[],logic:"and"};for(var a in e.filters)void 0!==e.filters[a].filters&&e.filters.splice(a,1);var y=r.dataSource;e.filters.push(p),y.filter(e),u(t)}),i.updateFeedbackCount=function(e,t){}}}}]),e.register.directive("appDetailsWrapper",["infrastructureService",function(e){return{restrict:"AE",scope:{instanceId:"@"},templateUrl:"app/modules/infra/templates/infra-server-app-details.html",link:function(t,r,i){e.getServerApplicationDetails(t.instanceId).then(function(e){t.data=e})}}}])})}();