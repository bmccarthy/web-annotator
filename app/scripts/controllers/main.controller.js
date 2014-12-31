(function (angular) {
  'use strict';

  var app = angular.module('web-annotator');

  app.controller('MainController', ['$scope', 'GUID', function ($scope, GUID) {
    var currentColorIndex = -1;
    var possibleColors = ['#ffff00', '#c30006', '#8329FD', '#8fbc8f'];

    var getNextColor = function () {
      currentColorIndex = (currentColorIndex + 1) % possibleColors.length;
      return possibleColors[currentColorIndex];
    };
    var webAnnotationAppId = 'gnmgpfnmpenmjohnockopbljbmpmabcg';

    $scope.newTag = {color: getNextColor()};
    $scope.projects = [];
    $scope.isAppInstalled = false;

    $scope.deleteProject = function (project) {
      var indexOfProject = $scope.projects.indexOf(project);
      $scope.projects.splice(indexOfProject, 1);
      $scope.currentProject = null;

      chrome.storage.sync.remove('currentProjectId');
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
      return $scope.currentProject === null || $scope.currentProject === undefined;
    };

    $scope.deleteTag = function (tag) {
      var indexOfTag = $scope.currentProject.tags.indexOf(tag);
      $scope.currentProject.tags.splice(indexOfTag, 1);
    };

    $scope.saveAnnotations = function () {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'get_html'}, function (response) {
          chrome.runtime.sendMessage(webAnnotationAppId, {type: 'save', data: response});
        });
      });
    };

    $scope.installWebAnnotatorApp = function () {
      var appDownloadLink = 'https://chrome.google.com/webstore/detail/web-annotator-app/gnmgpfnmpenmjohnockopbljbmpmabcg';
      chrome.tabs.create({url: appDownloadLink});
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
      if (project === null || project === undefined) {
        chrome.storage.sync.remove('currentProjectId');
      } else {
        chrome.storage.sync.set({currentProjectId: project.id});
      }
    };

    $scope.init = function () {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'get_isLinksActive'}, function (response) {
          $scope.$apply(function () {
            $scope.isLinksActive = response;
          });

          // after setting the current isLinksActive, set a watch on it so that future changes to the checkbox send the message to the current tab.
          $scope.$watch('isLinksActive', function (isActive) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {type: 'isLinksActive_changed', isLinksActive: isActive});
            });
          });
        });
      });

      chrome.storage.sync.get('isActive', function (data) {
        $scope.$apply(function () {
          $scope.isActive = data.isActive;
        });

        $scope.$watch('isActive', function (isActive) {
          chrome.storage.sync.set({isActive: isActive});
        });
      });

      chrome.storage.sync.get('showPreview', function (data) {
        $scope.$apply(function () {
          $scope.showPreview = data.showPreview;
        });

        $scope.$watch('showPreview', function (showPreview) {
          chrome.storage.sync.set({showPreview: showPreview});
        });
      });

      chrome.storage.sync.get('currentProjectId', function (data) {
        var currentProjectId = data.currentProjectId;

        chrome.storage.sync.get('projects', function (dataProjects) {
          $scope.$apply(function () {
            $scope.projects = dataProjects.projects || [];
          });

          if (currentProjectId) {
            var currentProject;

            for (var i = 0; i < $scope.projects.length; i++) {
              if ($scope.projects[i].id === currentProjectId) {
                currentProject = $scope.projects[i];
                break;
              }
            }

            if (currentProject) {
              $scope.$apply(function () {
                $scope.currentProject = currentProject;
              });
            }
          }

          $scope.$watch('projects', function (projects) {
            chrome.storage.sync.set({projects: projects});
          }, true);
        });
      });

      chrome.storage.onChanged.addListener(function (changes) {

        if (changes.showPreview !== undefined) {
          $scope.$apply(function () {
            $scope.showPreview = changes.showPreview.newValue;
          });
        }
      });

      chrome.runtime.sendMessage(webAnnotationAppId, {type: 'ping'}, function (response) {
        var isAppInstalled = response !== undefined;

        $scope.$apply(function () {
          $scope.isAppInstalled = isAppInstalled;
        });
      });
    };
  }]);
})(window.angular);
