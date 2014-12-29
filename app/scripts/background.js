(function () {
  'use strict';

  var showPreview = true,
    isLinksActive = true,
    currentProject = null,
    projects = [];

  function updateBadge(isActive) {
    chrome.browserAction.setBadgeText({text: isActive ? 'on' : 'off'});
  }

  function sendToEachTab(message) {
    chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, message);
      }
    });
  }

  function onIsActiveChanged(active) {
    updateBadge(active);

    if (currentProject == null) {
      return;
    }

    if (active) {
      sendToEachTab({type: 'activate', project: currentProject});
    } else {
      sendToEachTab({type: 'deactivate'});
    }
  }

  function onCurrentProjectChanged(currentProjectId) {
    var found = false;

    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === currentProjectId) {
        currentProject = projects[i];
        found = true;
        break;
      }
    }

    if (found === false) {
      currentProject = null;
    }

    sendToEachTab({type: 'project_changed', project: currentProject});
  }

  function onProjectsChanged(newProjects) {
    projects = newProjects;

    if (currentProject != null) {
      onCurrentProjectChanged(currentProject.id);
    }
  }

  chrome.storage.sync.get('projects', function (projectsData) {
    if (projectsData.projects == null) {
      projects = [];
      currentProject = null;
      return;
    }

    projects = projectsData.projects || [];

    chrome.storage.sync.get('currentProjectId', function (data) {
      var currentProjectId = data.currentProjectId;

      if (currentProjectId == null) {
        currentProject = null;
        return;
      }

      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === currentProjectId) {
          currentProject = projects[i];
          return;
        }
      }

      currentProject = null;

      chrome.storage.sync.get('isActive', function (data) {
        onIsActiveChanged(data.isActive === true);
      });
    });
  });

  chrome.storage.onChanged.addListener(function (changes) {
    for (var key in changes) {
      switch (key) {
        case 'isActive':
          onIsActiveChanged(changes[key].newValue);
          break;
        case  'projects':
          onProjectsChanged(changes[key].newValue);
          break;
        case 'currentProjectId':
          onCurrentProjectChanged(changes[key].newValue);
          break;
        default:
          break;
      }
    }
  });
})();
