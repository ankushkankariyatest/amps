(function () {
    "use strict";
    define(['assetIt', 'sites-services'], function (app) {
        app.register.directive('genericTreeView', ['sitesServices', function (sitesServices) {
            return {
                restrict: "AE",
                template: '<div class="input-group input-group-sm assetIT-main-left_pane_search_control">\
                            <input id="treeSearch" type="text" class="form-control" ng-model="treeSearch" placeholder="Search..." aria-describedby="search field">\
                            <span class="filter-site-clear"></span>\
                            <span class="input-group-btn">\
                                <button class="btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i></button>\
                            </span>\
                        </div>\
                        <div class="tree-view-info site-tree-view-nav-scroller"></div>',
                scope: { updateView: '&', updateTreeData: '=', treeModel: '=' },
                link: function (scope, element, attrs) {
                    //updateTreeView(data)
                    $.fn.extend({
                        treed: function (o) {
                            var openedClass = '';//'glyphicon-minus-sign';
                            var closedClass = '';//'glyphicon-plus-sign';

                            if (typeof o != 'undefined') {
                                if (typeof o.openedClass != 'undefined') {
                                    openedClass = o.openedClass;
                                }
                                if (typeof o.closedClass != 'undefined') {
                                    closedClass = o.closedClass;
                                }
                            };

                            //initialize each of the top levels
                            var tree = $(this);
                            tree.addClass("tree");
                            tree.find('li').has("ul").each(function () {
                                //branch.removeClass('active');
                                var branch = $(this); //li with children ul
                                branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
                                branch.addClass('branch');
                                branch.on('click', function (e) {
                                    if (this == e.target) {
                                        var icon = $(this).children('i:first');
                                        $(this).children().children().toggle();
                                        var branchSiblings = branch.siblings('li');
                                        branchSiblings.removeClass('active');
                                        branchSiblings.find('ul li').css('display', 'none');
                                        branchSiblings.find('i').removeClass(openedClass);
                                        branchSiblings.find('i').addClass(closedClass);
                                        $(this).addClass('active');
                                        icon.toggleClass(openedClass + " " + closedClass);

                                    }
                                })
                                branch.children().children().toggle();
                            });
                            //fire event from the dynamically added icon
                            tree.find('.branch .indicator').on('click', function () {
                                $(this).closest('li').click();
                            });
                            //fire event to open branch if the li contains an anchor instead of text
                            tree.find('.branch>a').on('click', function (e) {
                                $(this).closest('li').click();
                                e.preventDefault();
                            });
                            //fire event to open branch if the li contains a button instead of text
                            tree.find('.branch>button').on('click', function (e) {
                                $(this).closest('li').click();
                                e.preventDefault();
                            });
                        }
                    });

                    element.find('.tree-view-info').kendoTreeView({
                        animation: false,
                        dataSource: scope.treeModel.datasource,
                        select: function onSelect(e) {
                            e.preventDefault();
                            var item = e.node;
                            var parent = this.parent(item);
                            var hasParentNode = (parent.length > 0);
                            var nodeModelItem = e.sender.dataItem(item);
                            var _nodeValue = (hasParentNode) ? item.textContent : this.text(item);
                            var parentText = (hasParentNode) ? this.text(parent) : '';

                            var treeview = {
                                hasParentNode:hasParentNode,
                                parent: {
                                    hasParent: hasParentNode,
                                    parentText: parentText
                                },
                                activeNode: nodeModelItem,
                                nodeValue: _nodeValue
                            };
                            this.select(item);
                            scope.updateView()(treeview);
                        },
                        dataTextField: scope.treeModel.dataTextField
                    });
                    element.find('#treeSearch').bind('input propertychange', function (e) {
                        if (undefined != scope.treeSearch) {
                            scope.treeSearch = $.trim(e.currentTarget.value);
                            filterTreeView();
                        }
                    });
                    function updateTree(data) {
                        if (data.length > 0) {
                            var _elem = element.find('.tree-view-info');
                            _elem.data('kendoTreeView').dataSource.data(data);
                            //Initialization of treeviews

                            _elem.data('kendoTreeView').select(_elem.find(".k-item").first());
                            _elem.data('kendoTreeView').trigger('select', { node: _elem.find(".k-item").first() });
                            //$('.k-treeview-lines').treed();
                        }
                    }
                    scope.treeModel.updateTreeView = function(data)
                    {
                        updateTree(data);
                    };
                    //scope.$on('$destroy', scope.$watch('updateTreeData', updateTree));

                    var isParentLevelSearch = false;
                    scope.treeModel.filterTreeSearch = function (text) {
                        scope.treeSearch = text;
                        isParentLevelSearch = true;
                        filterTreeView();
                    }

                    function filterTreeView() {
                        var _elm = element.find('.tree-view-info').data("kendoTreeView");
                        _elm.expand(".k-item");


                        var term = $.trim(scope.treeSearch);
                        var items = _elm.dataSource.data();
                        if(_elm.options.dataTextField.length==2 && !isParentLevelSearch)
                        {
                            var _siteOptions = scope.treeModel.filterOptions;
                            var that = {};
                            that.nodeFilter = { logic: "and", filters: [] };

                            if(_siteOptions.activeSiteType != 'All'){
                                that.nodeFilter.filters.push({ field: "SITE_TYP", operator: "contains", value: _siteOptions.activeSiteType });
                            }

                            /*if(_siteOptions.activeTreeFilter =='Site'){
                                that.nodeFilter.filters.push({field: 'SITE_NM', operator: "contains",  value: term });
                            }else if(_siteOptions.activeTreeFilter =='Cyber System') {
                                _.each(items, function (item, index) {
                                    item.children.filter({field: "CYBER_SYSTEM_NAME", operator: "contains", value: term});
                                });
                                element.find('.tree-view-info').find(".k-group .k-group .k-in").closest("li").hide();
                                var _node = element.find('.tree-view-info').find(".k-group .k-group .k-in:contains('" + term + "')");
                                _node.each(function () {
                                    $(this).closest("ul").show();
                                    $(this).closest("li").show();
                                });
                            }*/

                            _.each(items, function (item, index) {
                                item.children.filter({field: "CYBER_SYSTEM_NAME", operator: "contains", value: term});
                            });
                            that.nodeFilter.filters.push(
                                {field: 'FACL_ID', operator: "eq",  value: term },
                                {field: 'SITE_NM', operator: "contains",  value: term }
                            );
                            element.find('.tree-view-info').find(".k-group .k-group .k-in").closest("li").hide();
                            var _node = element.find('.tree-view-info').find(".k-group .k-group .k-in:contains('" + term + "')");
                            _node.each(function () {
                                $(this).closest("ul").show();
                                $(this).closest("li").show();
                            });
                            _elm.dataSource.filter(that.nodeFilter);
                        }else{
                            _elm.dataSource.filter({
                                field: scope.treeModel.filterText,
                                operator: ('FACL_ID'==scope.treeModel.filterText)? "eq": "contains",
                                value: term
                            });
                        }

                        isParentLevelSearch = false;
                        //$('.k-treeview-lines').treed();
                    };

                    scope.$watch('treeModel.filterOptions', function (newValue, oldValue) {
                        if(undefined!== newValue && newValue!=oldValue){
                            var _siteOptions = newValue;
                            var _elm = element.find('.tree-view-info').data("kendoTreeView");
                            _elm.select($());
                            if(_siteOptions.activeSiteType != 'All'){
                                _elm.dataSource.filter({ field: "SITE_TYP", operator: "contains", value: _siteOptions.activeSiteType });
                            }else{
                                _elm.dataSource.filter({});
                            }
                            var _treeTopNode = element.find('.tree-view-info .k-item').first();
                            _elm.select(_treeTopNode);
                            _elm.trigger('select', { node: _treeTopNode });
                            //$('.k-treeview-lines').treed();
                        }
                    }, true);
                    element.find('.filter-site-clear').bind('click', function (e) {
                        if (undefined !== scope.treeSearch && '' != scope.treeSearch.trim()) {
                            var _elm = element.find('.tree-view-info').data("kendoTreeView");
                            _elm.collapse(".k-item");
                            var _isSiteSearch = scope.treeModel.filterOptions;
                            if(undefined!== _isSiteSearch && 'undefined'!=_isSiteSearch && _isSiteSearch.activeSiteType!= 'All') {
                                _elm.dataSource.filter(
                                    { field: "SITE_TYP", operator: "contains", value: _isSiteSearch.activeSiteType });
                            }else{
                                _elm.dataSource.filter({});
                            }
                            scope.treeSearch = '';
                            _elm.select($());
                            var _treeTopNode = element.find('.tree-view-info .k-item').first();
                            _elm.select(_treeTopNode);
                            _elm.trigger('select', { node: _treeTopNode });

                            //$('.k-treeview-lines').treed();
                            if (scope.$$phase != '$digest') {
                                scope.$digest();
                            }
                        }
                    });
                    element.find('#treeSearch').bind('click', function (e) {
                        e.stopPropagation();
                    });
                }
            }
        }]);
    });
})();