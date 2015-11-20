myApp.controller('PageListingCtrl', function ($scope, $http, $stateParams , $state, ngProgress , ListPage) {
    $('.removeActiveClass').removeClass('active');
    $('#page-listing').addClass('active');

    $scope.listcurrentPage = 0;
    $scope.listpageSize = 10;
    $scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.disable_btn= true ;

    ListPage.getListPageData(function(data){
        $scope.distributionChannels = data.DistributionChannel;
        $scope.pageType = data.PageType;
        var obj = {cd_id:0,cd_name:'All'}
        $scope.pageType.unshift(obj);

    });

    $scope.ExportPageList = function () {
        ListPage.exportPageList({ PageDetails:  $scope.pageDetails }, function (data) {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
            window.saveAs(blob, 'PageList.xlsx');
        });
    }
    $scope.search = function(){
        $scope.disable_btn = false;
        var criteria = {
            distributionChannelId : $scope.selectedDistributionChannel,
            page_type : $scope.selectedPageType,
            page_title : $scope.selectedPageTitle
        }
        ListPage.getListPageDetailOnSearch(criteria,function(data){
            $scope.pageDetails = data.PageDetails;
        },function(error){
            console.log(error);
        });
    }

   $scope.EditPage = function(pageid){
       $state.go('edit-page',{'pageId':pageid});
   }
    $scope.MapPage = function(pageid){
        $state.go('map-package',{'pageId':pageid});
    }
});
