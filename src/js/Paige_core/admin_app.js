'use strict';

/* App Module */

angular.module('timeoutAdmin', ['timeoutAdminFilters']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/partners', {templateUrl: '/admin/partnerlist.html',   controller: PartnerListCtrl}).
      when('/addTimeout', {templateUrl: '/admin/addTimeout.html', controller: addTimeoutCtrl}).
      otherwise({redirectTo: '/partners'});
}]);
