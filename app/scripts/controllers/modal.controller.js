(function () {
  'use strict';

  var app = angular.module('web-annotator-modal', []);

  app.directive('ngEscape', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 27) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEscape);
          });

          event.preventDefault();
        }
      });
    };
  });

  app.directive('ngDraggable', function () {
    return function (scope, element, attrs) {
      element.bind('dragstart', function (e) {

        var style = window.getComputedStyle(e.target, null);

        var left = parseInt(style.getPropertyValue("left"), 10) - e.clientX;
        var top = parseInt(style.getPropertyValue("top"), 10) - e.clientY;

        e.dataTransfer.setData("text/plain", left + ',' + top + ',' + element.attr('id'));
      });
    };
  });

  app.directive('ngDroppable', function () {
    return function (scope, element, attrs) {
      element.bind('drop', function (e) {

        var offset = e.dataTransfer.getData("text/plain").split(',');

        if (offset.length !== 3) return;

        var originalLeft = parseInt(offset[0], 10);
        var originalTop = parseInt(offset[1], 10);
        var draggedElement = document.getElementById(offset[2]);

        draggedElement.style.left = (e.clientX + originalLeft) + 'px';
        draggedElement.style.top = (e.clientY + originalTop) + 'px';

        e.preventDefault();
        e.stopPropagation();
      });

      element.bind('dragover', function (e) {
        e.preventDefault();
      });

      element.bind('dragenter', function (e) {
        e.preventDefault();
      });
    };
  });

  app.controller('ModalController', ['$scope', '$window', function ($scope, $window) {
    $scope.tags = [];
    $scope.showPreview = false;
    $scope.currentText = "";
    $scope.currentTag = "";
    $scope.isInEditMode = false;

    var pageOrigin;

    var sendMessageToPage = function (msg) {
      if (pageOrigin == null) {
        return;
      }

      window.parent.postMessage(msg, pageOrigin);
    };

    $scope.closeModal = function () {
      // the modal dialog stays open, instead a message is sent back to the content page to hide the iframe
      sendMessageToPage({});
    };

    $scope.deleteAnnotation = function () {
      var msg = {
        deleteAnnotation: {
          annotationId: $scope.annotationId
        }
      };

      sendMessageToPage(msg);
    };

    $scope.saveAnnotation = function () {

      if (!$scope.annotationForm.$valid) {
        return;
      }

      var msg = {};

      if ($scope.isInEditMode) {
        msg.editAnnotation = {
          annotationId: $scope.annotationId,
          tag: $scope.currentTag.name
        };
      } else {
        msg.newAnnotation = {
          tag: $scope.currentTag.name,
          selectedText: $scope.currentText
        };
      }

      // send the new annotation back to the content page so it can wrap the text with the correct html tag
      sendMessageToPage(msg);
    };

    $scope.updateShowPreview = function () {
      if (chrome && chrome.storage) {
        chrome.storage.sync.set({showPreview: $scope.showPreview});
      }
    };

    // listen for all events from the content page
    $window.addEventListener('message', function (e) {
      if (e.data == null) {
        return;
      }

      pageOrigin = e.origin;

      if (e.data.tags != null) {
        $scope.$apply(function () {
          $scope.tags = e.data.tags;
        });
      }

      if (e.data.currentTag != null && $scope.tags != null) {
        for (var i = 0; i < $scope.tags.length; i++) {
          if ($scope.tags[i].name === e.data.currentTag) {
            $scope.$apply(function () {
              $scope.currentTag = $scope.tags[i];
            });
            break;
          }
        }
      }

      if (e.data.showPreview != null) {

        $scope.$apply(function () {
          $scope.showPreview = e.data.showPreview;
        });
      }

      if (e.data.action === "edit") {
        $scope.$apply(function () {
          $scope.action = "Edit";
          $scope.isInEditMode = true;
          $scope.annotationId = e.data.annotationId;
          $scope.annotationForm.$setPristine();
          $scope.currentText = e.data.selectedText;
        });
      } else {
        // assume it is a new annotation if action is not specified
        $scope.$apply(function () {
          $scope.action = "New";
          $scope.isInEditMode = false;
          $scope.annotationForm.$setPristine();
          $scope.currentText = e.data.selectedText;
        });
      }

    }, false);

    // if this page is running in a chrome extension
    if (chrome && chrome.storage) {
      chrome.storage.onChanged.addListener(function (changes) {
        for (var key in changes) {
          if (key === "showPreview") {
            var storageChange = changes[key];
            $scope.$apply(function () {
              $scope.showPreview = storageChange.newValue;
            });
            break;
          }
        }
      });
    }

  }]);
})();
