'use strict';

/* App Module */

angular.module('timeoutAdmin', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/partners', {templateUrl: '/admin/partnerlist.html',   controller: PartnerListCtrl}).
//      when('/partners/:partnerId', {templateUrl: 'admin/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/partners'});
}]);
