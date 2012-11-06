angular.module('timeoutAdminFilters', []).filter('timeoutStatus', function() {
  return function(input) {
      
    console.log("input is ",input);
    switch(input){
    case "0":
        return "creating";
    case "1":
    	//var html = "<button ng-click=\"removeTimeout(partner.personA)\">remove</button>";
        // return "created";
        return "finished";
    default:
        return "";
    }
    
  };
});