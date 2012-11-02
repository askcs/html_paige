
function PartnerListCtrl($scope, $http) {
//  $http.get('phones/phones.json').success(function(data) {
//    $scope.phones = data;
//  });
//
//  $scope.orderProp = 'age';
    
    $http({method: 'GET', url: admin_session.appServices + "operator/getAllAskatars", headers : { 'X-SESSION_ID' : admin_session.sessionKey} }).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
        
        $scope.error = "Success : "+ data +" status: "+ status + " headers : " + headers;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with status
      // code outside of the <200, 400) range
       $scope.error = "Error : "+ data +" status: "+ status + " headers : " + headers;
    });
    
//    $scope.partners = [
//      {"personA": "mma",
//       "personB": "xiaoyu",
//       "contact": "contact"},
//       {"personA": "mma1",
//        "personB": "xiaoyu1",
//        "contact": "contact1"},
//    ];
    
}