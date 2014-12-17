'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

var updateBadge = function (isActive){
  chrome.browserAction.setBadgeText({text: isActive ? "on" : "off"});
};

chrome.storage.sync.get("isActive", function(data){
  updateBadge(data.isActive);

  chrome.storage.onChanged.addListener(function (changes) {
    for (var key in changes) {
      if( key === "isActive"){
        var storageChange = changes[key];
        updateBadge(storageChange.newValue);
      }
    }
  });
});
