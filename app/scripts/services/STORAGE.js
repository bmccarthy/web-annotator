var app = angular.module('web-annotator');

app.factory('STORAGE', ["$q", function ($q) {
  return getAppStorage($q);
}]);

