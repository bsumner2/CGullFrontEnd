async function hashPassword(pass) {
  const unicodedPass = new TextEncoder().encode(pass);
  return await crypto.subtle.digest('SHA-256', unicodedPass);
}

async function passToSHA256Hex(password) {
  return await hashPassword(password).then((hash) => {
    var digestBytes = new Uint8Array(hash);
    var hex = '';
    for (let i=0; i < digestBytes.length; ++i) {
      var byteStr = digestBytes[i].toString(16);
      byteStr = byteStr.length == 1 ? '0' + byteStr : byteStr;
      hex = hex + byteStr;
    }
    return hex;
  });


}



app.controller('AdminLoginController', function($scope, $window, $http) {
  var ctx = this;
  $scope.logErr = false;

  ctx.login = function() {
    if (ctx.username == null) {
      $scope.failMsg = 'Please specify a username!';
      $scope.logErr = true;
      return;
    }
    if (ctx.password == null) {
      $scope.failMsg = 'Please specify your password!';
      $scope.logErr = true;
    }

    passToSHA256Hex(ctx.password).then((hex) => {
      return $http.post(API_ADDR + '/Admins/Login?username=' + ctx.username, '\"' + hex + '\"');
    }).then(
      () => {
        $scope.logErr = false;
        $window.location.href = 'admin.html';
      }, 
      (rsp) => {
        $scope.failMsg = rsp.data;
        $scope.logErr = true;
      });
  };
});
