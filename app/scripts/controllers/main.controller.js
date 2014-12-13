var app = angular.module('web-annotator');

app.controller('MainController', ['$scope', "STORAGE", "GUID", function ($scope, STORAGE, GUID) {
  var currentColorIndex = -1;
  var possibleColors = ["#ffff00", "#c30006", "#8329FD", "#8fbc8f"];

  var getNextColor = function () {
    currentColorIndex = (currentColorIndex + 1) % possibleColors.length;
    return possibleColors[currentColorIndex];
  };

  $scope.projects = [];

  $scope.saveConfig = function (key, value) {
    STORAGE.set(key, value);
  };

  $scope.deleteProject = function (project) {
    console.log("project to delete: " + JSON.stringify(project));

    var indexOfProject = $scope.projects.indexOf(project);
    $scope.projects.splice(indexOfProject, 1);
    $scope.currentProject = null;

    STORAGE.del("currentProjectId");
  };

  $scope.submitNewProject = function (projectName) {

    if (!$scope.newProjectForm.$valid) {
      return;
    }

    var newProject = {name: projectName, tags: []};
    newProject.id = GUID.getGuid();

    $scope.projects.push(newProject);
    $scope.currentProject = newProject;

    STORAGE.set("currentProjectId", newProject.id);

    $scope.newProjectName = undefined;
  };

  $scope.isNew = function () {
    return $scope.currentProject == null;
  };

  $scope.deleteTag = function (tag) {
    var indexOfTag = $scope.currentProject.tags.indexOf(tag);
    $scope.currentProject.tags.splice(indexOfTag, 1);
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
    console.log("projectChanged: " + JSON.stringify(project));

    if (project == null) {
      STORAGE.del("currentProjectId");
    } else {
      STORAGE.set("currentProjectId", project.id);
    }
  };

  $scope.init = function () {
    console.log("initializing popup");

    $scope.newTag = {color: getNextColor()};

    STORAGE.get("projects").then(function (projects) {
      $scope.projects = projects || [];

      // get the current project id after the projects have all been retrieved.
      STORAGE.get("currentProjectId").then(function (currentProjectId) {
        var projectFound = false;

        if (currentProjectId != null) {
          for (var i = 0; i < $scope.projects.length; i++) {
            if ($scope.projects[i].id === currentProjectId) {
              projectFound = true;
              $scope.currentProject = $scope.projects[i];
              break;
            }
          }
        }

        if (projectFound === false) {
          console.log('project not found: ' + currentProjectId); // TODO: what should happen in this case.
        }
      });
    });

    STORAGE.get("isLinksActive").then(function (isLinksActive) {
      console.log("isLinksActive retrieved from storage: " + isLinksActive);
      if (isLinksActive == null) {
        $scope.isLinksActive = true;
      } else {
        $scope.isLinksActive = isLinksActive;
      }
    });

    STORAGE.get("showPreview").then(function (showPreview) {
      console.log("showPreview retrieved from storage: " + showPreview);
      if (showPreview == null) {
        $scope.showPreview = true;
      } else {
        $scope.showPreview = showPreview;
      }
    });

    STORAGE.get("isActive").then(function (isActive) {
      console.log("isActive retrieved from storage: " + isActive);
      if (isActive == null) {
        $scope.isActive = true;
      } else {
        $scope.isActive = isActive;
      }
    });

    $scope.$watch('projects', function (newVal) {
      console.log("saving projects");
      STORAGE.set("projects", $scope.projects);
    }, true);
  };
}]);
