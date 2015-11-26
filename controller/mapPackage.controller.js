/**
 * Created by darhamid on 17/11/15.
 */
var mysql = require('../config/db').pool;
var async = require("async");
var mapPackageManager = require('../models/mapPackageModel');
var _ = require('underscore');

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
                    },
                    mappingPackageData: function( callback ) {
                        if( req.body.pageId !== undefined ) {
                            mapPackageManager.getMappingPackageDataByPageId(connection_ikon_cms, req.body.pageId, req.session.publish_StoreId, function ( err, mappingPackageData ) {
                                callback(err, mappingPackageData);
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

exports.getPackageInfo = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms ) {
                //console.log( req.body.packageId );
                if( req.body.packageId != undefined ) {

                    mapPackageManager.getPackageInfoByPackId(connection_ikon_cms, req.body.packageId, req.session.publish_StoreId, function (err, result) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            if( result.length == 0 ) {
                                connection_ikon_cms.release();
                                res.send({
                                    error: true,
                                    message: 'The given PackageId is either deleted or disabled !. Please provide a valid package Id',
                                    status: 500
                                });/*var portletIds = [];
                    console.log( req.body );
                    async.forEach( req.body, function( item, callback ){
                        //console.log( req.body )
                        if( !_.contains( portletIds, parseInt( item.portletId ) ) ){
                            portletIds.push( parseInt( item.portletId ) );
                        }
                    });

                    console.log( portletIds );*/
                            }else {
                                connection_ikon_cms.release();
                                res.send({
                                    success: true,
                                    status: 200
                                });
                            }
                        }
                    });
                } else {
                    connection_ikon_cms.release();
                    res.send({
                        error: true,
                        message: 'Please select a package Id',
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

exports.addOrUpdateMapPortletData = function (req, res, next) {
    try {
        if (req.session && req.session.publish_UserName) {
            mysql.getConnection('CMS', function ( err, connection_ikon_cms ) {
                if( req.body.length > 0 ) {
                    addOrUpdateMappingPackageData( connection_ikon_cms, req.body, req, res );
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

function addOrUpdateMappingPackageData( connection_ikon_cms, mappingData, req, res ) {

    var mappingCount = mappingData.length - 1;
    loopMappingData( 0 );
    function loopMappingData( count ) {
        mapPackageManager.checkPortletDetailsExist( connection_ikon_cms, mappingData[count].portletId, mappingData[count].portletMapId, function( err, response ){
            console.log(mappingData[count]);
            console.log(response);
            if( response.length > 0 ) {
                if( mappingData[count].packageId != response[0].pmpp_sp_pkg_id ) {
                    //updateMappingPackageDetails( req, res, connection_ikon_cms, response[0], mappingData[count] );
                }
            }else {
                //console.log(mappingData);
                //addMappingPackageDetails( req, res, connection_ikon_cms, mappingData[count] );
            }

            if( count == mappingCount ){
                connection_ikon_cms.release();
                res.send({
                    success: true,
                    message: 'Mapping data added successfully',
                    status: 200
                });
            }else {
                count = count + 1;
                loopMappingData( count );
            }
        });
    }
}

function updateMappingPackageDetails( req, res, connection_ikon_cms, updateData, mappingData ) {
    async.series({
        DeleteMappingPackage : function( callback ){
            mapPackageManager.updateMappingPackage( connection_ikon_cms, updateData, function( err, DeleteMappingPackage ) {
                callback( err, DeleteMappingPackage );
            });
        },
        AddMappingPackage : function( callback ){
            addMappingPackageDetails(  req, res, connection_ikon_cms, mappingData );
            callback( null, null );
            /*mapPackageManager.getLastInsertedMapPortletId( connection_ikon_cms , function( err, lastInsertedId ) {
                console.log( "lastInsertedId " + lastInsertedId );
                if (err) {
                    connection_ikon_cms.release();
                    res.status(500).json(err.message);
                } else {
                    var mappingPackageData = {
                        pmpp_id: lastInsertedId != null ? parseInt( lastInsertedId + 1 ) : 1,
                        pmpp_ppp_id : mappingData.portletId,
                        pmpp_sp_pkg_id: mappingData.packageId,
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
                            console.log("data inserted");
                        }
                    });
                }
            });*/
        },
    }, function( err, result ){
         if (err) {
             console.log( err );
             connection_ikon_cms.release();
             res.status(500).json(err.message);
         } else {
            console.log( result );
         }
    });
}

function addMappingPackageDetails(  req, res, connection_ikon_cms, mappingData ) {
    mapPackageManager.getLastInsertedMapPortletId( connection_ikon_cms , function( err, lastInsertedId ) {
        //console.log( "lastInsertedId " + lastInsertedId );
        if (err) {
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        } else {
           // console.log( mappingData );
            if(mappingData.portletMapId != undefined){
                lastInsertedId = mappingData.portletMapId;
            }else{
                lastInsertedId = lastInsertedId != null ? parseInt( lastInsertedId + 1 ) : 1;
            }
            var mappingPackageData = {
                pmpp_id: lastInsertedId,
                pmpp_ppp_id : mappingData.portletId,
                pmpp_sp_pkg_id: mappingData.packageId,
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
                    console.log("data inserted")
                }
            });
        }
    });
}
