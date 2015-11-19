/**
 * Created by darhamid on 18/11/15.
 */


myApp.service('mapPackage', ['$http', function ($http) {

    this.baseRestUrl = "";
    this.getMappingData = function( data, success ){
        $http.post( this.baseRestUrl + '/getMappingData', data ).success(function ( response ) {
            success( response );
        });
    }

    this.addMapPortletData = function( data, success ){
        $http.post( this.baseRestUrl + '/addMapPortletData', data ).success(function ( response ) {
            success( response );
        });
    }

    this.getPackageInfo = function( data, success ){
        $http.post( this.baseRestUrl + '/getPackageInfo', data ).success(function ( response ) {
            success( response );
        });
    }
}]);