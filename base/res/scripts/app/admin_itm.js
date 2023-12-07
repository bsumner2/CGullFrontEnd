app.controller('AdminItemController', function($scope, $window, $http) {
  var itemHandle = this;
  $scope.invalidEmail=false;
  itemHandle.id = location.search.substring(4, 10);
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
      $scope.origPrice = rsp.data[0].msrp;
      $scope.origStock = rsp.data[0].stock;
      $scope.origStatus = rsp.data[0].onSale;
    }, function errorcb(rsp) {
      console.log('[Error]: Failed to request item by Id. Details:');
      console.log(rsp.data);
      $window.location.href = 
          "item.html?id=000030";
//      $window.location.href = "pagedne.html?type=item&additionalInfo=" + itemHandle.id;
    }
  );
  
  $scope.validatePrice = () => {
    if (itemHandle.instance.msrp < 0) {
      itemHandle.instance.msrp = 0;
    } else if (itemHandle.instance.msrp > 1000000) {
      itemHandle.instance.msrp = 1000000;
    }
  };

  $scope.validateStock = () => {
    if (itemHandle.instance.stock < 0)
      itemHandle.instance.stock = 0;
    if (itemHandle.instance.stock > 10000)
      itemHandle.instance.stock = 10000;
  };

  itemHandle.editItem = () => {
    let deltaMSRP = $scope.origPrice - itemHandle.instance.msrp;
    deltaMSRP = deltaMSRP > 0 ? deltaMSRP : (-1)*deltaMSRP;  // Absolute value
    if (deltaMSRP >= 0.0097) {
      $http.post(API_ADDR + '/Inventory/ChangePrice?itemId=' + itemHandle.id + '&price=' + itemHandle.instance.msrp.toString(), '').then(
        () => {console.log('Price change success');}, () => {console.log('Price change failed');}
      );
    } else { console.log('delta is' + deltaMSRP)}

    let deltaStock = $scope.origStock - itemHandle.instance.stock;
    deltaStock *= deltaStock > 0 ? 1 : -1;

    if (deltaStock >= 1) {
      $http.put(API_ADDR + '/Inventory/UpdateStock?itemId=' + itemHandle.id + '&quantity=' + itemHandle.instance.stock.toString(), '').then(
        () => {console.log('Stock change successful.');}, ()=>{console.log('Stock change failed.');});
    }

    if (itemHandle.instance.onSale != $scope.origStatus) {
      $http.put(API_ADDR + '/Inventory/ChangeSaleStatus?itemId=' + itemHandle.id + '&status=' + (itemHandle.instance.onSale ? 'true' : 'false'), '').then(
        () => {console.log('Status change successful.');}, ()=>{console.log('Status change failed.');});
    }
  }



});

