var mysql = require('../config/db').pool;
var async = require("async");
var nodeExcel = require('excel-export');
var pageManager = require('../models/pageModel');
var listpageManager = require('../models/listPageModel');

exports.getListPageData = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                        DistributionChannel: function (callback) {
                            pageManager.getAllDistributionChannelsByStoreId(connection_ikon_cms, req.session.publish_StoreId, function(err,DistributionChannel){
                                callback(err,DistributionChannel);
                            });
                        },
                        PageType: function (callback) {
                            listpageManager.getAllPageType(connection_ikon_cms, function(err,pageType){
                                callback(err,pageType);
                            });
                        },
                    },
                    function (err, results) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            connection_ikon_cms.release();
                            res.send(results);
                        }
                    });
            });
        }else{

        }
    }catch(err){


    }

};
exports.getListPageDetailOnSearch = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                var DetailData = {
                    storeId:  req.session.publish_StoreId,
                    distributionChannelId: req.body.distributionChannelId,
                    pageType:req.body.page_type,
                    pageTitle:req.body.page_title
                }
                async.parallel({
                        PageDetails: function (callback) {
                            listpageManager.getAllPageTypeDetails(connection_ikon_cms, DetailData, function(err,pageDetails){
                                callback(err,pageDetails);
                            });
                        }
                    },
                    function (err, results) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            connection_ikon_cms.release();
                            res.send(results);
                        }
                    });
            });
        }else{

        }
    }catch(err){


    }



};
/**
 * @function exportplan
 * @param req
 * @param res
 * @description process page list for download in to excel/xml format
 */
exports.exportPageList = function (req, res) {
    try {
        var conf = {};
        conf.cols = [{
            caption: 'Page Id',
            captionStyleIndex: 1,
            type: 'number',
            width: 10
        }, {
            caption: 'Page Title',
            captionStyleIndex: 1,
            type: 'string',
            width: 30
        }, {
            caption: 'Page Type',
            type: 'string',
            width: 30
        }, {
            caption: 'File Name',
            type: 'string',
            width: 30
        }, {
            caption: 'Total Portlets',
            type: 'number',
            width: 20
            }, {
            caption: 'Created On',
            type: 'string',
            width: 30
        }];
        var rows = [];
        var cnt = 1;

        req.body.PageDetails.forEach(function (data) {
            var pageDetail = [];
            pageDetail.push(cnt);
            pageDetail.push(data.pp_page_title);
            pageDetail.push(data.cd_name);
            pageDetail.push(data.pp_page_file);
            pageDetail.push(data.count);
            pageDetail.push(data.pp_date );
            rows.push(pageDetail);
            cnt++;
        })
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=PageList.xlsx");
        res.end(result, 'binary');
    }
    catch (error) {
        console.log(error.message);
    }
};