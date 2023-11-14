let app = angular.module('CGullWebsite', []);

app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
  // Add self and backend origin point to trusted list
  $sceDelegateProvider.trustedResourceUrlList([
    'self',
    'http://localhost:5041/**',
    'https://localhost:7247/**',
  ]);
}]);

const API_ADDR= "https://localhost:7247";
