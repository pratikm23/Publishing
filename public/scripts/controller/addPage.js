myApp.controller('addPageCtrl', function ($scope, $http, $stateParams,$state, ngProgress, Page) {
	$('.removeActiveClass').removeClass('active');
    $('#add-page').addClass('active');
    $scope.PageTitle = 'Register New';
    if($stateParams.pageId){
     $scope.PageTitle = 'Edit';   
    }
    
	$scope.success = "";
    $scope.successvisible = false;
    $scope.error = "";
    $scope.errorvisible = false;
    $scope.CurrentPage = $state.current.name;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');
    $scope.selectedPortletTypes = {};
    $scope.packageCounts = {};
    $scope.portletComments = {};
    
    $scope.portlets = [{}];

    $scope.addPortlet = function(){
        var portlet = {};
        $scope.portlets.push(portlet);
    };

    $scope.PortletTypes = [
        {cd_id : 0,cd_name:'Normal'},
        {cd_id : 1, cd_name: 'Banner'}
    ]

    $scope.PageTypes = [
        {cd_id : 1,cd_name:'Home Page'},
        {cd_id : 2, cd_name: 'Sub-Home Page'},
        {cd_id : 3, cd_name: 'Content Listing Page'},
        {cd_id : 4, cd_name: 'First Constent Page'},
        {cd_id : 5, cd_name: 'Promotion Page'},
        {cd_id : 6, cd_name: 'Other Page'}
    ];

    Page.getPageData(function(data){
        $scope.distributionChannels = data.DistributionChannel;
    });

});