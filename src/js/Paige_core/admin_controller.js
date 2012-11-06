
function PartnerListCtrl($scope, $http) {
    
    
    var getPartners = function($scope,$http){
        $http({method: 'GET', url: admin_session.appServices + "timeout/admin/tmlist", headers : { 'X-SESSION_ID' : admin_session.sessionKey} }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
            $scope.partners = data;
//            $scope.error = "Success : "+ data +" status: "+ status + " headers : " + headers;
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with status
          // code outside of the <200, 400) range
           $scope.error = "Error : "+ data +" status: "+ status + " headers : " + headers;
        });
    }
    
    getPartners($scope,$http);
    
    $scope.removeTimeout = function(personId) {
        if(window.confirm("Are you sure you want to delete Timeout for user "+personId + "?")){
            var para = {"userId" : personId};
            dataCon.post("timeout/removeTimeout",para,function(res){
                
                if(res == "ok"){
                    getPartners($scope,$http);
                }else{
//                    alert("no Timeout config for this user : "+personId);
                    alert_timeout(res);
                    getPartners($scope,$http);
                }
            });  
        }
    }
}

function addTimeoutCtrl($scope){
    
}