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

    $scope.init = function() {
        if ($stateParams.pageId == '') {
            $stateParams.pageId = undefined;
        }

        $scope.pageId = $stateParams.pageId;

        var data = {
            pageId: $scope.pageId
        }
        $scope.mapPackage = {};

        mapPackage.getMappingData(data, function (mappingPageData) {
            $scope.mappingData = angular.copy(mappingPageData.mappingData);
            $scope.mappingPackageData = angular.copy(mappingPageData.mappingPackageData);

            var mappingArray = [];
            var mKey = 0;
            angular.forEach($scope.mappingPackageData, function (mapValue, mapKey) {
                if (_.contains(mappingArray, mapValue.pmpp_ppp_id)) {
                    mKey++;
                } else {
                    mappingArray.push(mapValue.pmpp_ppp_id);
                    mKey = 0;
                }
                if (!_.has($scope.mapPackage, mapValue.pmpp_ppp_id)) {
                    $scope.mapPackage[mapValue.pmpp_ppp_id] = {};
                }
                if (!_.has($scope.mapPackage[mapValue.pmpp_ppp_id], mKey)) {
                    $scope.mapPackage[mapValue.pmpp_ppp_id][mKey] = {};
                }

                $scope.mapPackage[mapValue.pmpp_ppp_id][mKey]['packageId'] = mapValue.pmpp_sp_pkg_id;
                $scope.mapPackage[mapValue.pmpp_ppp_id][mKey]['portletMapId'] = mapValue.pmpp_id;
            });
         });
     };

    $scope.init();

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();


    $scope.checkValidPackage = function( packageId , packageIndex ) {
        if( $( "#packageId_" + packageIndex ).val() != '' ) {
            delay(function () {
                var packageObj = {
                    "packageId": $("#packageId_" + packageIndex).val()
                }
                mapPackage.getPackageInfo(packageObj, function (response) {
                    if (response.error == true) {
                        toastr.error(response.message);
                        $("#packageId_" + packageIndex).val('');
                        $("#packageId_" + packageIndex).focus();
                    }
                });
            }, 200);
        }
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
                            "packageId" : mapPackageObject.packageId,
                            "portletMapId" : mapPackageObject.portletMapId
                        });
                    });
                }
            });
            if( $scope.mapPackageData.length > 0 ) {
                ngProgress.start();
                mapPackage.addOrUpdateMapPortletData( $scope.mapPackageData, function( response ){
                    if (response.success) {
                        toastr.success(response.message);
                        ngProgress.complete();
                        setTimeout( function() {
                            $scope.init();
                        }, 1000 );

                    }
                });
            }
        }
    }
    $scope.isNumber = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if( (isNaN(String.fromCharCode(key)) && key !=8 )||key == 32) e.preventDefault();
    }
});
