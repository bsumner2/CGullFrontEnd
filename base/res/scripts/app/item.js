app.controller('AdminItemController', function($scope, $window, $http) {
  var itemHandle = this;
  $scope.invalidEmail=false;
  itemHandle.id = location.search.substring(4, 10);
  $scope.cartTarget = itemHandle.id;
  itemHandle.selectedQty = 1;
  itemHandle.promptUsrReg = false;
  itemHandle.addRsp = "";
  itemHandle.rspErr = false;
  itemHandle.registerName = "";

  itemHandle.associatedBundles = [];
  itemHandle.bundleDTOList = []; 
    
  itemHandle.apiAddr = API_ADDR;
  if (itemHandle.id.length != 6 || itemHandle.id[0] != '0') {
    $window.location.href = "item.html?id=000030";
//    $window.location.href = "pagedne.html?type=item&additionalInfo=" + itemHandle.id;
  }

  itemHandle.instance = null;
  $http.get(API_ADDR + '/Item/GetById?idList=' + itemHandle.id).then(
    function successcb(rsp) {
      itemHandle.instance = rsp.data[0];
    }, function errorcb(rsp) {
      console.log('[Error]: Failed to request item by Id. Details:');
      console.log(rsp.data);
      $window.location.href = 
          "item.html?id=000030";
//      $window.location.href = "pagedne.html?type=item&additionalInfo=" + itemHandle.id;
    }

  );

  $http.get(API_ADDR + '/Item/GetAssociatedBundles?id=' + itemHandle.id).then(
    function(rsp) {
      itemHandle.associatedBundles = rsp.data;
    }, function(err) {
    }
  );

  itemHandle.getBundles = function() {
    if (itemHandle.bundleDTOList.length != 0) {
      return itemHandle.bundleDTOList;
    }
    itemHandle.bundleDTOList = [];
    for (i=0; i < itemHandle.associatedBundles.length; ++i) {
      let curr = {
        Details: null,
        BundleItems: []
      };
      $http.get(API_ADDR + '/Item/GetById?idList='+ itemHandle.associatedBundles[i].itemId).then(
        (srsp) => {
          curr.Details = srsp.data[0];
          console.log(srsp);

        }, (ersp) => {console.log(ersp);}
      );
      $http.get(API_ADDR + '/Item/GetBundleItems?bundleId=' + itemHandle.associatedBundles[i].itemId).then(
        (srsp) => {
          curr.BundleItems = srsp.data;
        }, (ersp) => {
          console.log(ersp);
        }
      );
      itemHandle.bundleDTOList.push(curr);
    }
    return itemHandle.bundleDTOList;
    
  }

  itemHandle.checkQtyValid = function() {
    itemHandle.selectedQty = (itemHandle.selectedQty < 0) ? 0 
        : ((itemHandle.selectedQty > itemHandle.instance.stock)
            ? itemHandle.instance.stock : itemHandle.selectedQty);
  }
  
  itemHandle.regCartAndAdd = function() {
    $scope.invalidEmail = false;
    if (itemHandle.registerName == "") {
      $scope.invalidEmail = true;
      return;
    }      
    $http.post(API_ADDR + '/Cart/CreateNewCart?name='+itemHandle.registerName[0], "").then(
      function successcb(rsp) {
        localStorage.setItem('cart', rsp.data);
        console.log('New cart: ' + rsp.data);
        itemHandle.promptUsrReg = false;
        itemHandle.addToCart();
      }, function errorcb(rsp) {
        itemHandle.rspErr=true;
        itemHandle.addRsp = rsp.data;
      }
    );
  };

  itemHandle.addToCart = function(id) {
    itemHandle.addRsp="";
    itemHandle.rspErr = false;
    $scope.cartTarget = id;
    var cartHandle = localStorage.getItem('cart');
    if (cartHandle == null) {
      itemHandle.promptUsrReg = true;
      return;
    }

    // else user already has cart
    $http.post(API_ADDR + '/Item/AddItemToCart?cartId=' 
      + cartHandle + '&itemId=' + $scope.cartTarget + '&quantity='
      + (itemHandle.id == $scope.cartTarget ? itemHandle.selectedQty : 1), "").
      then(function successcb(rsp) {
        itemHandle.addRsp = rsp.data;
        console.log(rsp.data);
        itemHandle.rspErr = false;
      }, function errorcb(rsp) {
        itemHandle.addRsp = rsp.data;
        itemHandle.rspErr = true;
      }
    );
  };



});

