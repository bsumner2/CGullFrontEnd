app.controller('FrontPageController', function($window, $http) {
  var frontPage = this;
  frontPage.listings = [];
  frontPage.categories = [];
  frontPage.searchText = "";
  frontPage.apiAddr = API_ADDR;
  $http.get(API_ADDR + '/Item/Category').then(
    function successcb(rsp) {
      frontPage.categories = [];
      for (i=0; i < rsp.data.length; ++i) {
        let categoryDelimited = rsp.data[i].name.split('_');
        let category = categoryDelimited[0][0].toUpperCase() 
          + categoryDelimited[0].substring(1);
        for (j=1; j < categoryDelimited.length; ++j) {
          if (categoryDelimited[j]=='and') {
            category += ' ' + categoryDelimited[j];
            continue;
          }
          category += ' ' + categoryDelimited[j][0].toUpperCase()
            + categoryDelimited[j].substring(1);
        }
        console.log(category);
        frontPage.categories.push(category);
      }
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
      let queryUrl = 
        API_ADDR + '/Item/GetByKeyword?keywordList='
        + frontPage.searchText.replaceAll(" ", "%26");
      $http.get(queryUrl).then(
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
