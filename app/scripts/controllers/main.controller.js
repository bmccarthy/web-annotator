(function () {
  'use strict';

  var app = angular.module('web-annotator');

  app.controller('MainController', ['$scope', "GUID", function ($scope, GUID) {
    var currentColorIndex = -1;
    var possibleColors = ["#ffff00", "#c30006", "#8329FD", "#8fbc8f"];

    var getNextColor = function () {
      currentColorIndex = (currentColorIndex + 1) % possibleColors.length;
      return possibleColors[currentColorIndex];
    };

    $scope.newTag = {color: getNextColor()};
    $scope.projects = [];

    chrome.storage.sync.get("isActive", function (data) {
      $scope.$apply(function () {
        $scope.isActive = data.isActive;
      });

      $scope.$watch("isActive", function (isActive) {
        chrome.storage.sync.set({isActive: isActive});
      });
    });

    chrome.storage.sync.get("showPreview", function (data) {
      $scope.$apply(function () {
        $scope.showPreview = data.showPreview;
      });

      $scope.$watch("showPreview", function (showPreview) {
        chrome.storage.sync.set({showPreview: showPreview});
      });
    });

    chrome.storage.sync.get("isLinksActive", function (data) {
      $scope.$apply(function () {
        $scope.isLinksActive = data.isLinksActive;
      });

      $scope.$watch("isLinksActive", function (isLinksActive) {
        chrome.storage.sync.set({isLinksActive: isLinksActive});
      });
    });

    chrome.storage.sync.get("currentProjectId", function (data) {
      var currentProjectId = data.currentProjectId;

      chrome.storage.sync.get("projects", function (dataProjects) {
        $scope.$apply(function () {
          $scope.projects = dataProjects.projects || [];
        });

        if (currentProjectId != null) {
          for (var i = 0; i < $scope.projects.length; i++) {
            if ($scope.projects[i].id === currentProjectId) {
              $scope.$apply(function () {
                $scope.currentProject = $scope.projects[i];
              });

              break;
            }
          }
        }

        $scope.$watch("projects", function (projects) {
          chrome.storage.sync.set({projects: projects});
        }, true);
      });
    });

    chrome.storage.onChanged.addListener(function (changes) {
      for (var key in changes) {
        if (key === "showPreview") {
          var storageChange = changes[key];

          $scope.$apply(function () {
            $scope.showPreview = storageChange.newValue;
          });
        }
      }
    });

    $scope.deleteProject = function (project) {
      var indexOfProject = $scope.projects.indexOf(project);
      $scope.projects.splice(indexOfProject, 1);
      $scope.currentProject = null;

      chrome.storage.sync.remove("currentProjectId");
    };

    $scope.submitNewProject = function (projectName) {

      if (!$scope.newProjectForm.$valid) {
        return;
      }

      var newProject = {name: projectName, tags: []};
      newProject.id = GUID.getGuid();

      $scope.projects.push(newProject);
      $scope.currentProject = newProject;

      chrome.storage.sync.set({currentProjectId: newProject.id});

      $scope.newProjectName = null;
    };

    $scope.isNew = function () {
      return $scope.currentProject == null;
    };

    $scope.deleteTag = function (tag) {
      var indexOfTag = $scope.currentProject.tags.indexOf(tag);
      $scope.currentProject.tags.splice(indexOfTag, 1);
    };

    $scope.saveAnnotations = function () {
      var webAnnotationAppId = "gnmgpfnmpenmjohnockopbljbmpmabcg";

      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "get_html"}, function (response) {
          chrome.runtime.sendMessage(webAnnotationAppId, response);
        });
      });
    };

    $scope.submitNewTag = function (newTag) {
      if (!$scope.newTagForm.$valid) {
        return;
      }

      $scope.currentProject.tags.push({name: newTag.name, color: newTag.color});

      $scope.newTag.name = null;
      $scope.newTag.color = getNextColor();
    };

    $scope.projectChanged = function (project) {
      if (project == null) {
        chrome.storage.sync.remove("currentProjectId");
      } else {
        chrome.storage.sync.set({currentProjectId: project.id});
      }
    };
  }]);
})();
