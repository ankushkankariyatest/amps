/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";
    define(['assetIt', 'jszip','pako_deflate'], function (app, jszip) {
        window.JSZip = jszip;
        app.register.service('exportUtil', ['$location', function ($location) {
                var _getFileName = function ()
                {
                    var _dateInfo = new Date();
                    return "AMPS" + $location.path() + (_dateInfo.getMonth() + 1) + '/' + _dateInfo.getDate() + '/' + _dateInfo.getFullYear();
                }

                var _exportToPdf = function (grid)
                {
                    var fileName = _getFileName();
                    var _pageSize = grid.dataSource.pageSize();
                    grid.dataSource.pageSize(grid.dataSource.total());
                    grid.options.pdf = {
                        fileName: fileName + ".pdf",
                        proxyURL: "/proxy",
                        allPages: true,
                    };
                    grid.saveAsPDF();
                }
                var _exportToExcel = function (grid, optionsExcel) {
                    var fileName = _getFileName();
                    var excelOptions = {
                        fileName: fileName + ".xlsx",
                        proxyURL: "/proxy",
                        allPages: true,
                        filterable: false
                    };
                    grid.options.excel = angular.extend(excelOptions, optionsExcel);
                    grid.saveAsExcel();
                }

                var _exportKendoGridToExcel = function () {
                    var fileName = _getFileName() + ".xlsx";
                    var grid = $("#grid").data("kendoGrid");
                    grid.options.excel = {
                        fileName: fileName,
                        proxyURL: "/proxy",
                        allPages: true,
                        filterable: false
                    };
                    grid.saveAsExcel();
                }

                var _exportToCsv = function (grid) {

                    var originalPageSize = grid.dataSource.pageSize();
                    var csv = '';
                    var fileName = _getFileName() + '.csv';

                    // Increase page size to cover all the data and get a reference to that data
                    grid.dataSource.pageSize(grid.dataSource.data().length);
                    var data = grid.dataSource.view();

                    //add the header row
                    for (var i = 0; i < grid.columns.length; i++) {
                        var field = grid.columns[i].field;
                        var title = grid.columns[i].title || field;

                        //NO DATA
                        if (!field)
                            continue;

                        title = title.replace(/"/g, '""');
                        csv += '"' + title + '"';
                        if (i < grid.columns.length - 1) {
                            csv += ',';
                        }
                    }
                    csv += '\n';

                    //add each row of data
                    for (var row in data) {
                        for (var i = 0; i < grid.columns.length; i++) {
                            var fieldName = grid.columns[i].field;
                            var template = grid.columns[i].template;
                            var exportFormat = grid.columns[i].exportFormat;

                            //VALIDATE COLUMN
                            if (!fieldName)
                                continue;
                            var value = '';
                            if (fieldName.indexOf('.') >= 0) {
                                var properties = fieldName.split('.');
                                var value = data[row] || '';
                                for (var j = 0; j < properties.length; j++) {
                                    var prop = properties[j];
                                    value = value[prop] || '';
                                }
                            } else {

                                value = data[row][fieldName] || '';
                            }
//                            if (value && template && exportFormat !== false) {
//                                value = _.isFunction(template) ? template(data[row]) : kendo.template(template)(data[row]);
//                            }

                            value = value.toString().replace(/"/g, '""');
                            csv += '"' + value + '"';
                            if (i < grid.columns.length - 1) {
                                csv += ',';
                            }
                        }
                        csv += '\n';
                    }

                    // Reset datasource
                    grid.dataSource.pageSize(originalPageSize);

                    //EXPORT TO BROWSER
                    var blob = new Blob([csv], {
                        type: 'text/csv;charset=utf-8'
                    }); //Blob.js
                    saveAs(blob, fileName); //FileSaver.js
                }
                var _exportKendoGridToCsv = function () {
                    var grid = $("#grid").data("kendoGrid");
                    var originalPageSize = grid.dataSource.pageSize();
                    var csv = '',
                            fileName = _getFileName() + '.csv';

                    // Increase page size to cover all the data and get a reference to that data
                    grid.dataSource.pageSize(grid.dataSource.view().length);
                    var data = grid.dataSource.view();

                    //add the header row
                    for (var i = 0; i < grid.columns.length; i++) {
                        var field = grid.columns[i].field;
                        var title = grid.columns[i].title || field;

                        //NO DATA
                        if (!field)
                            continue;

                        title = title.replace(/"/g, '""');
                        csv += '"' + title + '"';
                        if (i < grid.columns.length - 1) {
                            csv += ',';
                        }
                    }
                    csv += '\n';

                    //add each row of data
                    for (var row in data) {
                        for (var i = 0; i < grid.columns.length; i++) {
                            var fieldName = grid.columns[i].field;
                            var template = grid.columns[i].template;
                            var exportFormat = grid.columns[i].exportFormat;

                            //VALIDATE COLUMN
                            if (!fieldName)
                                continue;
                            var value = '';
                            if (fieldName.indexOf('.') >= 0)
                            {
                                var properties = fieldName.split('.');
                                var value = data[row] || '';
                                for (var j = 0; j < properties.length; j++) {
                                    var prop = properties[j];
                                    value = value[prop] || '';
                                }
                            }
                            else {

                                value = data[row][fieldName] || '';
                            }
                            if (value && template && exportFormat !== false) {
                                value = _.isFunction(template)
                                        ? template(data[row])
                                        : kendo.template(template)(data[row]);
                            }

                            value = value.toString().replace(/"/g, '""');
                            csv += '"' + value + '"';
                            if (i < grid.columns.length - 1) {
                                csv += ',';
                            }
                        }
                        csv += '\n';
                    }

                    // Reset datasource
                    grid.dataSource.pageSize(originalPageSize);

                    //EXPORT TO BROWSER
                    //TODO replace with downloadify so we can get proper file naming
                    window.open("data:text/csv;charset=utf-8," + escape(csv))
                }
                //Filesaver.js from http://jsfiddle.net/rhagerma/bCRm3/
                var saveAs = saveAs
                        // IE 10+ (native saveAs)
                        || (typeof navigator !== "undefined" &&
                                navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
                        // Everyone else
                        || (function (view) {
                            "use strict";
                            // IE <10 is explicitly unsupported
                            if (typeof navigator !== "undefined" &&
                                    /MSIE [1-9]\./.test(navigator.userAgent)) {
                                return;
                            }
                            var
                                    doc = view.document
                                    // only get URL when necessary in case Blob.js hasn't overridden it yet
                                    , get_URL = function () {
                                        return view.URL || view.webkitURL || view;
                                    }
                            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
                                    , can_use_save_link = "download" in save_link
                                    , click = function (node) {
                                        var event = doc.createEvent("MouseEvents");
                                        event.initMouseEvent(
                                                "click", true, false, view, 0, 0, 0, 0, 0
                                                , false, false, false, false, 0, null
                                                );
                                        node.dispatchEvent(event);
                                    }
                            , webkit_req_fs = view.webkitRequestFileSystem
                                    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
                                    , throw_outside = function (ex) {
                                        (view.setImmediate || view.setTimeout)(function () {
                                            throw ex;
                                        }, 0);
                                    }
                            , force_saveable_type = "application/octet-stream"
                                    , fs_min_size = 0
                                    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
                                    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
                                    // for the reasoning behind the timeout and revocation flow
                                    , arbitrary_revoke_timeout = 500 // in ms
                                    , revoke = function (file) {
                                        var revoker = function () {
                                            if (typeof file === "string") { // file is an object URL
                                                get_URL().revokeObjectURL(file);
                                            } else { // file is a File
                                                file.remove();
                                            }
                                        };
                                        if (view.chrome) {
                                            revoker();
                                        } else {
                                            setTimeout(revoker, arbitrary_revoke_timeout);
                                        }
                                    }
                            , dispatch = function (filesaver, event_types, event) {
                                event_types = [].concat(event_types);
                                var i = event_types.length;
                                while (i--) {
                                    var listener = filesaver["on" + event_types[i]];
                                    if (typeof listener === "function") {
                                        try {
                                            listener.call(filesaver, event || filesaver);
                                        } catch (ex) {
                                            throw_outside(ex);
                                        }
                                    }
                                }
                            }
                            , FileSaver = function (blob, name) {
                                // First try a.download, then web filesystem, then object URLs
                                var
                                        filesaver = this
                                        , type = blob.type
                                        , blob_changed = false
                                        , object_url
                                        , target_view
                                        , dispatch_all = function () {
                                            dispatch(filesaver, "writestart progress write writeend".split(" "));
                                        }
                                // on any filesys errors revert to saving with object URLs
                                , fs_error = function () {
                                    // don't create more object URLs than needed
                                    if (blob_changed || !object_url) {
                                        object_url = get_URL().createObjectURL(blob);
                                    }
                                    if (target_view) {
                                        target_view.location.href = object_url;
                                    } else {
                                        var new_tab = view.open(object_url, "_blank");
                                        if (new_tab == undefined && typeof safari !== "undefined") {
                                            //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                            view.location.href = object_url
                                        }
                                    }
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch_all();
                                    revoke(object_url);
                                }
                                , abortable = function (func) {
                                    return function () {
                                        if (filesaver.readyState !== filesaver.DONE) {
                                            return func.apply(this, arguments);
                                        }
                                    };
                                }
                                , create_if_not_found = {create: true, exclusive: false}
                                , slice
                                        ;
                                filesaver.readyState = filesaver.INIT;
                                if (!name) {
                                    name = "download";
                                }
                                if (can_use_save_link) {
                                    object_url = get_URL().createObjectURL(blob);
                                    save_link.href = object_url;
                                    save_link.download = name;
                                    click(save_link);
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch_all();
                                    revoke(object_url);
                                    return;
                                }
                                // prepend BOM for UTF-8 XML and text/plain types
                                if (/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                                    blob = new Blob(["\ufeff", blob], {type: blob.type});
                                }
                                // Object and web filesystem URLs have a problem saving in Google Chrome when
                                // viewed in a tab, so I force save with application/octet-stream
                                // http://code.google.com/p/chromium/issues/detail?id=91158
                                // Update: Google errantly closed 91158, I submitted it again:
                                // https://code.google.com/p/chromium/issues/detail?id=389642
                                if (view.chrome && type && type !== force_saveable_type) {
                                    slice = blob.slice || blob.webkitSlice;
                                    blob = slice.call(blob, 0, blob.size, force_saveable_type);
                                    blob_changed = true;
                                }
                                // Since I can't be sure that the guessed media type will trigger a download
                                // in WebKit, I append .download to the filename.
                                // https://bugs.webkit.org/show_bug.cgi?id=65440
                                if (webkit_req_fs && name !== "download") {
                                    name += ".download";
                                }
                                if (type === force_saveable_type || webkit_req_fs) {
                                    target_view = view;
                                }
                                if (!req_fs) {
                                    fs_error();
                                    return;
                                }
                                fs_min_size += blob.size;
                                req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                                    fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                                        var save = function () {
                                            dir.getFile(name, create_if_not_found, abortable(function (file) {
                                                file.createWriter(abortable(function (writer) {
                                                    writer.onwriteend = function (event) {
                                                        target_view.location.href = file.toURL();
                                                        filesaver.readyState = filesaver.DONE;
                                                        dispatch(filesaver, "writeend", event);
                                                        revoke(file);
                                                    };
                                                    writer.onerror = function () {
                                                        var error = writer.error;
                                                        if (error.code !== error.ABORT_ERR) {
                                                            fs_error();
                                                        }
                                                    };
                                                    "writestart progress write abort".split(" ").forEach(function (event) {
                                                        writer["on" + event] = filesaver["on" + event];
                                                    });
                                                    writer.write(blob);
                                                    filesaver.abort = function () {
                                                        writer.abort();
                                                        filesaver.readyState = filesaver.DONE;
                                                    };
                                                    filesaver.readyState = filesaver.WRITING;
                                                }), fs_error);
                                            }), fs_error);
                                        };
                                        dir.getFile(name, {create: false}, abortable(function (file) {
                                            // delete file if it already exists
                                            file.remove();
                                            save();
                                        }), abortable(function (ex) {
                                            if (ex.code === ex.NOT_FOUND_ERR) {
                                                save();
                                            } else {
                                                fs_error();
                                            }
                                        }));
                                    }), fs_error);
                                }), fs_error);
                            }
                            , FS_proto = FileSaver.prototype
                                    , saveAs = function (blob, name) {
                                        return new FileSaver(blob, name);
                                    }
                            ;
                            FS_proto.abort = function () {
                                var filesaver = this;
                                filesaver.readyState = filesaver.DONE;
                                dispatch(filesaver, "abort");
                            };
                            FS_proto.readyState = FS_proto.INIT = 0;
                            FS_proto.WRITING = 1;
                            FS_proto.DONE = 2;

                            FS_proto.error =
                                    FS_proto.onwritestart =
                                    FS_proto.onprogress =
                                    FS_proto.onwrite =
                                    FS_proto.onabort =
                                    FS_proto.onerror =
                                    FS_proto.onwriteend =
                                    null;

                            return saveAs;
                        }(
                                typeof self !== "undefined" && self
                                || typeof window !== "undefined" && window
                                || this.content
                                ));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

//                if (typeof module !== "undefined" && module.exports) {
//                    module.exports.saveAs = saveAs;
//                } else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
//                    define([], function () {
//                        return saveAs;
//                    });
//                }
                return {
                    exportToPdf: _exportToPdf,
                    exportToExcel: _exportToExcel,
                    exportToCsv: _exportToCsv,
                    exportKendoGridToExcel: _exportKendoGridToExcel,
                    exportKendoGridToCsv: _exportKendoGridToCsv
                }
            }]);
    });
})();

