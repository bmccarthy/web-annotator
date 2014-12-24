'use strict';

var isActive = false,
  showPreview = true,
  isLinksActive = true,
  currentProject = null,
  projects = [];

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

var updateBadge = function (isActive) {
  chrome.browserAction.setBadgeText({text: isActive ? 'on' : 'off'});
};

var sendToEachTab = function (message) {
  chrome.tabs.query({}, function (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, message);
    }
  });
};

var onIsActiveChanged = function (active) {
  isActive = active;
  updateBadge(active);

  if (active) {
    sendToEachTab({type: 'activate', project: currentProject});
  } else {
    sendToEachTab({type: 'deactivate'});
  }
};

var onCurrentProjectChanged = function (currentProjectId) {
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
};

var onIsLinksActiveChanged = function (linksActive) {
  isLinksActive = linksActive;
  sendToEachTab({type: 'toggle_links_active', isLinksActive: isLinksActive});
};

var onShowPreviewChanged = function (sp) {
  showPreview = sp;
  sendToEachTab({type: 'toggle_show_preview', showPreview: sp});
};

function handleMessage(request, sender, sendResponse){
  console.log('Message received in background: ' + JSON.stringify(request));
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.storage.sync.get('isActive', function (data) {
  onIsActiveChanged(data.isActive === true);
});

chrome.storage.sync.get('showPreview', function (data) {
  onShowPreviewChanged(data.showPreview == null || data.showPreview === true);
});

chrome.storage.sync.get('isLinksActive', function (data) {
  onIsLinksActiveChanged(data.isLinksActive == null || data.isLinksActive);
});

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

    for (var i = 0; i < projectsData.projects.length; i++) {
      if (projectsData.projects[i].id === currentProjectId) {
        console.log('setting project: ' + JSON.stringify(projectsData.projects[i]));
        currentProject = projectsData.projects[i];
        return;
      }
    }

    console.log('setting project: null');
    currentProject = null;
  });
});

chrome.storage.onChanged.addListener(function (changes) {
  for (var key in changes) {
    switch (key) {
      case 'isActive':
        onIsActiveChanged(changes[key].newValue);
        break;
      case 'showPreview':
        onShowPreviewChanged(changes[key].newValue);
        break;
      case  'projects':
        break;
      case 'isLinksActive':
        onIsLinksActiveChanged(changes[key].newValue);
        break;
      case 'currentProjectId':
        onCurrentProjectChanged(changes[key].newValue);
        break;
      default:
        console.log('unknown storage item changed: ' + JSON.stringify(changes));
        break;
    }
  }
});
