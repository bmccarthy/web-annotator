/*global MyGuidProvider:false */

(function () {
  'use strict';

  var currentProject = null,
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

    if (!currentProject) {
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

    if (currentProject) {
      onCurrentProjectChanged(currentProject.id);
    }
  }

  function loadData() {
    chrome.storage.sync.get('projects', function (projectsData) {
      if (!projectsData.projects) {
        projects = [];
        currentProject = null;
        return;
      }

      projects = projectsData.projects || [];

      chrome.storage.sync.get('currentProjectId', function (data) {
        var currentProjectId = data.currentProjectId;

        if (!currentProjectId) {
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
  }

  loadData();

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

  // Check whether new version is installed
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {

      var guidProvider = new MyGuidProvider();

      var cp = {
        id: guidProvider.getGuid(),
        name: 'Sample Annotation Project',
        tags: [{name: 'PERSON', color: '#EAEA46'}, {name: 'LOCATION', color: '#4646EA'}, {name: 'DATETIME', color: '#FF0508'}]
      };

      chrome.storage.sync.set({isActive: true});
      chrome.storage.sync.set({showPreview: true});
      chrome.storage.sync.set({currentProjectId: cp.id});
      chrome.storage.sync.set({projects: [cp]});
    }
  });

})();
