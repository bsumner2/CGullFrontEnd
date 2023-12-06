app.controller('ItemController', function($scope, $window, $http) {
  var itemHandle = this;
  $scope.invalidEmail=false;
  itemHandle.id = location.search.substring(4, 10);
  itemHandle.selectedQty = 1;
  itemHandle.promptUsrReg = false;
  itemHandle.addRsp = "";
  itemHandle.rspErr = false;
  itemHandle.registerName = "";

  itemHandle.associatedBundles = [];
  
    
    
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

  $http.get(API_ADDR + '/Item/GetAssociatedBundles/' + itemHandle.id).then(
    function(rsp) {
      itemHandle.associatedBundles = rsp.data;

    }, function(err) {
    }
  );

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

    // Regex to parse email. Matches <email_handle> in strings formatted as
    // <email_handle>@<domain>, where <domain> is any number of alphabeticals-only
    // substrings delimited by periods and ending in any alphabeticals-only
    // substring after last period.
    // e.g: 
    //   Matches:
    //     user22 from user22@gmail.com burt from burt@email.uni.edu
    //   Won't Match:
    //     u$er@gma!1.c0m user@@gmail.com, etc.
//    let name = 
//      itemHandle.registerName.match(
//        /[A-Za-z0-9]/);
// /[A-Za-z0-9]+(?=@([A-Za-z]+\.+([a-z]+)/);
    

//      itemHandle.registerName.match(/[A-Za-z0-9]+(?=@[[A-Za-z]+\.[mcon][aore][imgt][l]*)/);
    if (name.length != 1) {
      $scope.invalidEmail=true;
      return;
    }
    if (name == null) {
      $scope.invalidEmail=true;
      return;
    }
    if (!itemHandle.registerName.startsWith(name[0])) {
      $scope.invalidEmail=true;
      return;
    }
      
    $http.post(API_ADDR + '/Cart/CreateNewCart?name='+name[0], "").then(
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

