angular.module('timeoutAdminFilters', []).filter('timeoutStatus', function() {
  return function(input) {
      
    switch(input){
    case "0":
        return "creating";
    case "1":
        return "created";
    default:
        return "";
    }
    
  };
});