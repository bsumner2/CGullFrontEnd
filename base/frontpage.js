angular.module('CGullWebsite', [])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
  // Add self and backend origin point to trusted list
  $sceDelegateProvider.trustedResourceUrlList([
    'self',
    'http://localhost:5278/**'
  ]);
}])
  .controller('FrontPageController', function($http) {
    var frontPage = this;
    frontPage.listings = [];
    frontPage.entryCt = function() {
      return this.listings == [] ? 0 
        : this.listings.length; 
    };
    frontPage.showListingsReplacement = function() {
      $http.get('http://localhost:5278/Product/Item/All', {}).then(
          function success_callback(rsp) {
            frontPage.listings = [];
            for (i = 0; i < rsp.data.length; i++)
              frontPage.listings.push(rsp.data[i]);
          }, function error_callback(rsp) {
            console.log(rsp.data);
          });
    };
    frontPage.showItemDesc = function(itm) {
      // quick and dirty toggle
      if (itm.altdesc == null) {
        itm.altdesc = itm.description;
        itm.description = null;
      } else {
        itm.description = itm.altdesc;
        itm.altdesc = null;
      }
    };
  });
