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
        var sortedArray = _.sortBy($scope.pageDetails, function(obj) { return obj.pp_id; });
        console.log(sortedArray)

        ListPage.exportPageList({ PageDetails:  sortedArray }, function (data) {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
            window.saveAs(blob, 'PageList.xlsx');
        });
    }
    $scope.search = function(valid) {
        if (valid) {
            if ($scope.selectedPageTitle && $scope.selectedPageTitle.length < 3) {
                toastr.error("Please enter atleast 3 characters.");
            }
            else{
                $scope.disable_btn = false;
            var criteria = {
                distributionChannelId: $scope.selectedDistributionChannel,
                page_type: $scope.selectedPageType,
                page_title: $scope.selectedPageTitle
            }
            ListPage.getListPageDetailOnSearch(criteria, function (data) {
                $scope.pageDetails = data.PageDetails;
            }, function (error) {
                console.log(error);
            });
          }
        }
    }

   $scope.EditPage = function(pageid){

       $state.go('edit-page',{'pageId':pageid});
   }
    $scope.MapPage = function(pageid){
     //   window.localStorage.setItem('curr_map_distribution_channel',$scope.pageDetails[pageid].cd_name);
       // console.log( $scope.distributionChannels);
        //debugger;
        window.localStorage.setItem('curr_map_page_dc',_.findWhere( $scope.distributionChannels, {cd_id: _.findWhere($scope.pageDetails, {pp_id: pageid}).pp_dc_id }).cd_name);
        window.localStorage.setItem('curr_map_page_type',_.findWhere($scope.pageDetails, {pp_id: pageid}).cd_name);
        window.localStorage.setItem('curr_map_page_title',_.findWhere($scope.pageDetails, {pp_id: pageid}).pp_page_title);
        window.localStorage.setItem('curr_map_page_filename',_.findWhere($scope.pageDetails, {pp_id: pageid}).pp_page_file);

        $state.go('map-package',{'pageId':pageid});
    }
});
