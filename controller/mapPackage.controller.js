/**
 * Created by darhamid on 17/11/15.
 */
var mysql = require('../config/db').pool;
var async = require("async");
var mapPackageManager = require('../models/mapPackageModel');

exports.getMappingData = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms ) {
                async.parallel({
                    mappingData: function( callback ) {
                        if( req.body.pageId !== undefined ) {
                            mapPackageManager.getMappingDataByPageId(connection_ikon_cms, req.body.pageId, req.session.publish_StoreId, function (err, mappingData) {
                                callback(err, mappingData);
                            });
                        }else {
                            callback( err, [] );
                        }
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
            res.send({ error: true, message: 'Your session has expired. Please login again.', status: 500 });
        }
    }catch(err){
        res.status(500).json(err.message);
    }
};

exports.addMapPortletData = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function ( err, connection_ikon_cms ) {
                if( req.body.length > 0 ) {
                    var packageIds = [];
                    async.forEach( req.body, function( item, callback ){
                        packageIds.push( item.packageId );
                    });
                    console.log( packageIds );
                    /*async.waterfall([
                        function (callback) {
                            mapPackageManager.getPackageInfoByPackId(connection_ikon_cms, packageIds, req.session.publish_StoreId, function( err, result ) {
                                if(err) {
                                    connection_ikon_cms.release();
                                    res.status(500).json(err.message);
                                    console.log(err.message)
                                } else {
                                    if (result.length > 0) {
                                        callback( err, {'exist': true, 'packageData': result });
                                    } else {
                                        callback(err, {'exist': false, 'packageData': result});
                                    }
                                }
                            });
                        },
                        function (data, callback) {
                            if( data.exist == true ) {
                                callback(null, {'exist': data.exist});
                            } else {
                                callback(null, {'exist': data.exist, message: 'No such package found !.'});
                            }
                        }
                    ],function (err, results) {
                        if (results.message) {
                            connection_ikon_cms.release();
                            res.send({"success": false, "message": results.message});
                        } else {
                            console.log( results );
                        }
                    });*/

                    //addMappingPackageData( connection_ikon_cms, req.body, req, res );
                }else{
                    res.send({
                        error: true,
                        message: 'Failed to load request data',
                        status: 500
                    });
                }
            });
        }else{
            res.send({ error: true, message: 'Your session has expired. Please login again.', status: 500 });
        }
    }catch(err){
        res.status(500).json(err.message);
    }
}

function addMappingPackageData( connection_ikon_cms, mappingData, req, res ) {

    var mappingCount = mappingData.length - 1;

    //checkValidPackage( req, res, connection_ikon_cms, mappingData, mappingCount );
    loopMappingData( 0 );
    function loopMappingData( count ) {
        /*mapPackageManager.getLastInsertedMapPortletId( connection_ikon_cms , function( err, lastInsertedId ) {
            if (err) {
                connection_ikon_cms.release();
                res.status(500).json(err.message);
            } else {
                console.log( mappingData );
                var mappingPackageData = {
                    pmpp_id: lastInsertedId != null ? parseInt( lastInsertedId + 1 ) : 1,
                    pmpp_ppp_id : mappingData[count].portletId,
                    pmpp_sp_pkg_id: mappingData[count].packageId,
                    pmpp_created_on : new Date(),
                    pmpp_created_by : req.session.publish_UserName,
                    pmpp_modified_on : new Date(),
                    pmpp_modified_by : req.session.publish_UserName
                }
                mapPackageManager.createMapPortletData( connection_ikon_cms, mappingPackageData, function( err, response ){
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    } else {
                        if( count == mappingCount ){
                            connection_ikon_cms.release();
                        }else {
                            count = count + 1;
                            loopMappingData( count );
                        }
                    }
                });
            }
        });*/
    }
}

exports.getPackageInfo = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms ) {
                if( req.body.packageId != undefined ) {
                    console.log( req.body.packageId );
                    mapPackageManager.getPackageInfoByPackId(connection_ikon_cms, req.body.packageId, req.session.publish_StoreId, function (err, result) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            if (result.length == 0) {
                                res.send({
                                    error: true,
                                    message: 'The given PackageId is either deleted or disabled !. Please provide a valid package Id',
                                    status: 500
                                });
                            }
                        }
                    });
                }
            });
        }else{
            res.send({ error: true, message: 'Your session has expired. Please login again.', status: 500 });
        }
    }catch(err){
        res.status(500).json(err.message);
    }
}