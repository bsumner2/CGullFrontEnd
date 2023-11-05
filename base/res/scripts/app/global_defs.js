let app = angular.module('CGullWebsite', []);

const API_ADDR= "http://localhost:5041";

app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
  // Add self and backend origin point to trusted list
  $sceDelegateProvider.trustedResourceUrlList([
    'self',
    'http://localhost:5041/**',
    'https://localhost:7247/**',
  ]);
}]);
