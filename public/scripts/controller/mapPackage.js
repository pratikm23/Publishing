/**
 * Created by darhamid on 17/11/15.
 */
myApp.controller('mapPackageCtrl', function( $scope, $http, $stateParams, $state, ngProgress, mapPackage ) {
    $('.removeActiveClass').removeClass('active');
    $('#map-package').addClass('active');
    $scope.PageTitle = 'Map Package';
    $scope.head_page_type = window.localStorage.getItem('curr_map_page_type')
    $scope.head_page_dc = window.localStorage.getItem('curr_map_page_dc')
    $scope.head_page_file = window.localStorage.getItem('curr_map_page_filename')
    $scope.head_page_title = window.localStorage.getItem('curr_map_page_title')

    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.hideReset = false;

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
                $scope.hideReset = true;
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
                $scope.portletId = mapValue.pmpp_id;

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


    $scope.checkValidPackage = function( portletId , packageIndex ) {
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

                        var splitIndex = packageIndex.split('_')[1]; 
                        $scope.mapPackage[portletId][splitIndex]['packageId'] = '';
                    }
                });
            }, 200);
        }
    }
    $scope.resetForm = function(){
        $scope.mapPackage = [];
    }

    $scope.submitForm = function( $valid ){
        var errorCount = 0;
            $.each( $scope.mapPackage, function( mapKey, mapObject ) {
            if( mapObject !== undefined ) {
                var mapPackageKey = mapKey;
                $.each( mapObject, function( key, mapPackageObject ) {
                    var packageObj = {
                        "packageId": mapPackageObject.packageId
                    }
                    mapPackage.getPackageInfo(packageObj, function (response) {
                        if (response.error == true) {

                            errorCount++;
                            $valid = false;
                        }
                    });


                });
            }
        });
        setTimeout(function () {
            if (errorCount == 0 && $valid) {
                $scope.mapPackageData = [];
                $.each($scope.mapPackage, function (mapKey, mapObject) {
                    if (mapObject !== undefined) {
                        var mapPackageKey = mapKey;
                        $.each(mapObject, function (key, mapPackageObject) {
                            $scope.mapPackageData.push({
                                "portletId": mapPackageKey,
                                "packageId": mapPackageObject.packageId,
                                "portletMapId": mapPackageObject.portletMapId
                            });
                        });
                    }
                });
                if ($scope.mapPackageData.length > 0) {
                    ngProgress.start();
//console.log($scope.mapPackageData);
                    mapPackage.addOrUpdateMapPortletData($scope.mapPackageData, function (response) {
                        if (response.success) {
                            toastr.success(response.message);
                            ngProgress.complete();
                            setTimeout(function () {
                                $scope.init();
                            }, 1000);

                        }
                    });
                }

            }
        }, 1000 );
    }
    $scope.isNumber = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if( (isNaN(String.fromCharCode(key)) && key !=8 )||key == 32) e.preventDefault();
    }
});
