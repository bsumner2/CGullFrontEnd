app.controller('FrontPageController', function($window, $http) {
  var frontPage = this;
  frontPage.listings = [];
  frontPage.categories = [];
  frontPage.searchText = "";
  frontPage.apiAddr = API_ADDR;
  $http.get(API_ADDR + '/Item/Category').then(
    function successcb(rsp) {
      frontPage.categories = [];
      for (i=0; i < rsp.data.length; ++i)
        frontPage.categories.push(rsp.data[i]);
    }, function errorcb(rsp) {
      console.log(rsp.data);
    }
  );

  frontPage.entryCt = function() {
    return this.listings == [] ? 0
      : this.listings.length;
  };
  frontPage.showListings = function() {
    if (frontPage.searchText != "") {
      let query = frontPage.searchText.replace(" ", "&");
      $http.get(API_ADDR + '/Item/GetByKeyword?keyWordList='+query).then(
        function successcb(rsp) {
          frontPage.listings = [];
          for (i = 0; i < rsp.data.length; ++i)
            if (rsp.data[i].id[0] == '0')
              frontPage.listings.push(rsp.data[i]);
        }, function errorcb(rsp) {
          console.log(rsp.data);
        }
      );
      return;
    }
    $http.get(API_ADDR + '/Item/GetAllItems', {}).then(
      function successcb(rsp) {
        frontPage.listings = [];
        for (i = 0; i < rsp.data.length; i++)
          if (rsp.data[i].id[0] == '0')
            frontPage.listings.push(rsp.data[i]);
      }, function errorcb(rsp) {
        console.log(rsp.data);
      }
    );
  };
  frontPage.redirectToItemPage = function(itm) {
    $window.location.href = 'item.html?id='+itm.id;
  };
});
