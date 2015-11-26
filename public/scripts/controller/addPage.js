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
    $scope.editInProgress = false;
    ngProgress.color('yellowgreen');
    ngProgress.height('3px');

$scope.init = function(){
    $scope.portletsArray = {};

    $scope.portlets = [{}];
    $scope.portletIds = [];

    $scope.addPortlet = function(){
        var portlet = {};
        $scope.portlets.push(portlet);
    };

    $scope.PortletTypes = [
        {cd_id : 0,cd_name:'Normal'},
        {cd_id : 1, cd_name: 'Banner'}
    ]

    preData = {
            state : "add-page"
    }

    //console.log('iddd');
    //console.log($stateParams.pageId);
    if($stateParams.pageId){
            //Change predata  for edit mode accordingly.
            $scope.edit_mode = true;
            preData.state  = "edit-page";
            preData.pageId = $stateParams.pageId;
            // $scope.isAdded  = true;
    }


    //console.log(preData);
   

    Page.getPageData(preData,function(data){
        $scope.distributionChannels = data.DistributionChannel;
        $scope.PageTypes = data.PageTypes;
        if($stateParams.pageId){
            $scope.pagetitle = data.PageDetails[0].pp_page_title;
            $scope.pagefilename = data.PageDetails[0].pp_page_file;
            $scope.selectedPageTypes = data.PageDetails[0].pp_page_type_id;
            $scope.selectedDistributionChannel = data.PageDetails[0].pp_dc_id;
            $.each( data.PortletDetails, function(key,value){
               if(key < data.PortletDetails.length - 1){
                      var portlet = {};
                     $scope.portlets.push(portlet);
               }
               $scope.portletsArray[key] = {};
               $scope.portletsArray[key]['portletType'] = value.ppp_type;
               $scope.portletsArray[key]['comment'] = value.ppp_comments;
               if(value.ppp_type == 1){ //if banner
                    $scope.portletsArray[key]['packageCount'] = null;
               }else{
                     $scope.portletsArray[key]['packageCount'] = value.ppp_pkg_allow;
               }
                
               $scope.portletsArray[key]['portletId'] = value.ppp_id;
               $scope.portletsArray[key]['isUpdate'] = 0;

               $scope.portletIds.push(value.ppp_id);
            })
        }
    },function(error){
        console.log(error);
    });
}
    
$scope.init();


    $scope.submitForm = function ( isValid ) {
        $scope.successvisible = false;
        $scope.errorvisible = false;
            var pageData = {
                page_title: $scope.pagetitle,
                page_filename: $scope.pagefilename,
                page_type: $scope.selectedPageTypes,
                distribution_channel: $scope.selectedDistributionChannel,
                portlets : $scope.portletsArray
            };
        if (isValid) {
            if($scope.pagefilename.match(/[a-z]+[.][a-z]+/) == $scope.pagefilename){
                if($stateParams.pageId){
                        $scope.editInProgress = true;
                        pageData.page_id = $stateParams.pageId;
                        pageData.portletIds = $scope.portletIds;
                       // console.log('in edit');
                        Page.editPage(pageData,function(data){
                            ngProgress.start();
                            if(data.status == 101){
                                toastr.error(data.message);
                            }
                            if(data.status == 200){
                                toastr.success(data.message);
                                 setTimeout( function() {
                                    $scope.init();
                                    $scope.editInProgress = false;
                                 },1000);
                            }
                            ngProgress.complete();
                        },function(error){
                            console.log(error);
                        });
                }else{
                        Page.addPage(pageData,function(data){
                             ngProgress.start();
                             if(data.status == 101){
                                toastr.error(data.message);
                             }
                             if(data.status == 200){
                                toastr.success(data.message);
                                $state.reload();
                             }
                             ngProgress.complete();
                        },function(error){
                            console.log(error);
                        });
                }
            }else{
                toastr.error('Invalid Page File Name . Page File Name must be in given format e.g. home.php');
            }
        }
    };




    $scope.isNumber = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if ( (isNaN( String.fromCharCode(key) ) && key != 8) || key == 32 ) e.preventDefault();
    }

    $scope.changePortletType = function(index){
        if($scope.portletsArray[index].portletType == undefined && !$stateParams.pageId){
           delete $scope.portletsArray[index];
           // delete $scope.portletIds[index];
        }else if($scope.portletsArray[index].portletType == undefined && $stateParams.pageId){
            // delete $scope.portletsArray[index];
            $scope.portletsArray[index].isUpdate = 1;
            $scope.portletsArray[index].comment = null;
            $scope.portletsArray[index].packageCount = null;
        }else if($scope.portletsArray[index].portletType == 1){ // if banner
            $scope.portletsArray[index].packageCount = null;
        }
    }
});