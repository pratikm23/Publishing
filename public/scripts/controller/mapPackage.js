/**
 * Created by darhamid on 17/11/15.
 */
myApp.controller('mapPackageCtrl', function( $scope, $http, $stateParams, $state, ngProgress, mapPackage ) {
    $('.removeActiveClass').removeClass('active');
    $('#map-package').addClass('active');
    $scope.PageTitle = 'Map Package';

    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');

    if( $stateParams.pageId == '' ) {
        $stateParams.pageId = undefined;
    }

    $scope.pageId = $stateParams.pageId;

    var data = {
        pageId : $scope.pageId
    }
    $scope.mapPackage = [];

    mapPackage.getMappingData( data, function( mappingPageData ){
        $scope.mappingData = angular.copy( mappingPageData.mappingData );
    });

    $scope.checkValidPackage = function( packageId ) {
        var packageObj = {
            "packageId" : packageId
        }
        mapPackage.getPackageInfo( packageObj, function( response ){
            if( response.error == true ) {
                toastr.error(response.message);
            }
        });
    }

    $scope.submitForm = function( $valid ){
        if( $valid ) {
            $scope.mapPackageData = [];
            $.each( $scope.mapPackage, function( mapKey, mapObject ) {
               if( mapObject !== undefined ) {
                    var mapPackageKey = mapKey;
                    $.each( mapObject, function( key, mapPackageObject ) {
                        $scope.mapPackageData.push({
                            "portletId" : mapPackageKey,
                            "packageId" : mapPackageObject.packageId
                        });
                    });
                }
            });
            if( $scope.mapPackageData.length > 0 ) {
                ngProgress.start();
                mapPackage.addMapPortletData( $scope.mapPackageData, function( response ){
                    if (response.success) {
                        toastr.success(response.message);
                        ngProgress.complete();
                    }
                });
            }
        }
    }
});
