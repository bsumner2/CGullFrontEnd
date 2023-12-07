function vanillaRedir(sublink) {
  window.location.href = sublink;
}


app.factory('FPCtx', function() {
  var context = {
    Categories: [],
    Query: "",
    CatSel: -1,
    SetQuery: function(searchStr) { context.Query = searchStr; },
    SetCategories: function(catList) { for (var i=1; i < catList.length; ++i) {context.Categories.push(catList[i]);} },
    SetSelectedCategory: function(category) {context.CatSel = category;}
  };
  return context;
});



app.controller('AdminFrontPageController', function($scope, $window, $http, FPCtx) {
  var frontPage = this;
  frontPage.listings = [];
  frontPage.apiAddr = API_ADDR;
  $scope.categories = FPCtx.Categories;

  frontPage.entryCt = function() {
    return this.listings == [] ? 0
      : this.listings.length;
  };


  frontPage.showListings = function() {
    if (FPCtx.Query!="") {
      let queryUrl = 
        API_ADDR + '/Item/GetByKeyword?keywordList='
        + FPCtx.Query.replaceAll(" ", "%26");
      $http.get(queryUrl).then(
        function successcb(rsp) {
          frontPage.listings = [];
          if (FPCtx.CatSel >= 0) {
            for (i = 0; i < rsp.data.length; ++i) {
              if (rsp.data[i].id[0] != '0' || 
                  (rsp.data[i].categoryId-1) != FPCtx.CatSel)
                continue;
              frontPage.listings.push(rsp.data[i]);
            }
          } else {
            for (i = 0; i < rsp.data.length; ++i) {
              if (rsp.data[i].id[0] != '0')
                continue;
              frontPage.listings.push(rsp.data[i]);
            }
          }
        }, function errorcb(rsp) {
          console.log(rsp.data);
        }
      );
      return;
    }
    $http.get(API_ADDR + '/Inventory/GetInventory', {}).then(
      function successcb(rsp) {
        frontPage.listings = [];
        if (FPCtx.CatSel >= 0) {
          for (i = 0; i < rsp.data.length; ++i) {
            if (rsp.data[i].id[0] != '0' ||
                (rsp.data[i].categoryId-1) != FPCtx.CatSel)
              continue;
            frontPage.listings.push(rsp.data[i]);
          }
          return;
        }
        for (i = 0; i < rsp.data.length; i++)
          if (rsp.data[i].id[0] == '0')
            frontPage.listings.push(rsp.data[i]);
      }, function errorcb(rsp) {
        console.log(rsp.data);
      }
    );
  };

  frontPage.redirectToItemEditorPage = function(itm) {
    $window.location.href = 'admin_item.html?id='+itm.id;
  };
});

app.controller('SearchController', function($scope, $window, $http, FPCtx) {
  var searchController = this;
  $scope.catsel = {Name: "All", Idx: -1};

  $scope.cartRedir = function() {
    console.log('test');
    $window.location.href = "cart.html";
  }


  searchController.updateQueryState = function() {
    FPCtx.SetQuery($scope.searchQuery);
  };

  searchController.setCatFilter = (() => {
    FPCtx.SetSelectedCategory($scope.catsel.Idx);
  });

  $http.get(API_ADDR + '/Item/Category').then(
    function successcb(rsp) {
      $scope.categories = [{Name: 'All', Idx: -1}];
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
        
        $scope.categories.push({Name: category, Idx: i});
      }
      FPCtx.SetCategories($scope.categories);
    }, function errorcb(rsp) {
      console.log(rsp.data);
    }
  );
}); 
