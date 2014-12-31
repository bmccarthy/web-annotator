/*global MyGuidProvider:false */

(function (angular) {
  'use strict';

  var app = angular.module('web-annotator');

  app.factory('GUID', function () {
    return new MyGuidProvider();
  });

})(window.angular);
