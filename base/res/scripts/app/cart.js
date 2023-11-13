app.controller('CartController', function($window, $http) {
  let crtHndl = this;
  crtHndl.id = localStorage.getItem('cart');
  crtHndl.cartEntries = null;
  crtHndl.contents = null;
  crtHndl.name = null;
  crtHndl.itemCt = -1;
  crtHndl.apiAddr = API_ADDR;
  crtHndl.updateCart = function() {
    $http.get(API_ADDR + '/Cart/GetCart?cartId=' + localStorage.getItem('cart')).then(
      function successcb(rsp) {
        crtHndl.name = rsp.data.name;
        crtHndl.cartEntries = [];
        for (var i=0; i < rsp.data.contents.length; ++i)
          crtHndl.cartEntries.push(rsp.data.contents[i]);
      }, function errorcb(rsp) {
        console.log(rsp.data);
        $window.location.href = "item.html?id=000030";
      }
    );
  }
  crtHndl.updateCart();
  
  crtHndl.getEntries = function() {
    if (crtHndl.cartEntries==[] || crtHndl.cartEntries==null)
      return [];
    if (crtHndl.contents != null)
      return crtHndl.contents;
    crtHndl.contents = [];
    let idList = crtHndl.cartEntries[0].productId;
    for (var i = 1; i < crtHndl.cartEntries.length; ++i)
      idList = idList + '%26' + crtHndl.cartEntries[i].productId;
    $http.get(API_ADDR + '/Item/GetById?idList=' + idList).then(
      function(rsp) {
        for (var i = 0; i < rsp.data.length; ++i)
          crtHndl.contents.push({
            product: rsp.data[i],
            quantity: crtHndl.cartEntries[i].quantity});
      }, function(rsp) {
        console.log(rsp.data);
        $window.location.href = "item.html?id=000030";
      }
    );
    return crtHndl.contents;
  }

  crtHndl.getItemCt = function() {
    if (crtHndl.cartEntries==[] || crtHndl.cartEntries==null)
      return 0;
    if (-1 < crtHndl.itemCt)
      return crtHndl.itemCt;
      
    crtHndl.itemCt = 0;
    for (var i=0; i < crtHndl.cartEntries.length; ++i) {
      crtHndl.itemCt += crtHndl.cartEntries[i].quantity;
    }
    return crtHndl.itemCt;
  }
});
