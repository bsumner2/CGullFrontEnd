app.controller('ItemController', function($scope, $window, $http) {
  var itemHandle = this;
  $scope.invalidEmail=false;
  itemHandle.id = location.search.substring(4, 10);
  itemHandle.selectedQty = 0;
  itemHandle.promptUsrReg = false;
  itemHandle.addRsp = "";
  itemHandle.rspErr = false;
  itemHandle.registerName = "";

  if (itemHandle.id.length != 6 || itemHandle.id[0] != '0') {
    $window.location.href = "pagedne.html?type=item&additionalInfo=" + itemHandle.id;
  }

  itemHandle.instance = null;
  $http.get(API_ADDR + '/Item/GetById?idList=' + itemHandle.id).then(
    function successcb(rsp) {
      itemHandle.instance = rsp.data[0];
    }, function errorcb(rsp) {
      console.log('[Error]: Failed to request item by Id. Details:');
      console.log(rsp.data);
      $window.location.href = "pagedne.html?type=item&additionalInfo=" + itemHandle.id;
    }

  );
  
  itemHandle.regCartAndAdd = function() {
    $scope.invalidEmail = false;
    if (itemHandle.registerName == "") {
      $scope.invalidEmail = true;
      return;
    }
    let name = 
      itemHandle.registerName.match(/[A-Za-z0-9]+(?=@[[A-Za-z]+\.[mcon][aore][imgt][l]*)/);
    if (name == null) {
      $scope.invalidEmail=true;
      return;
    }
    $http.post(API_ADDR + '/Cart/CreateNewCart?name='+name, "").then(
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

  itemHandle.addToCart = function() {
    itemHandle.addRsp="";
    itemHandle.rspErr = false;
    var cartHandle = localStorage.getItem('cart');
    if (cartHandle == null) {
      itemHandle.promptUsrReg = true;
      return;
    }

    // else user already has cart
    $http.post(API_ADDR + '/Item/AddItemToCart?cartId=' 
      + cartHandle + '&itemId=' + itemHandle.id + '&quantity='
      + itemHandle.selectedQty, "").
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

