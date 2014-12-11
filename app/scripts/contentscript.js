'use strict';

var isLinksActive = true;
var tagApplier;

var checkUnsaved = function () {

};

var turnOffLinks = function () {
  isLinksActive = false;
};

var turnOnLinks = function () {
  isLinksActive = true;
};

var toggleLinks = function () {
  if (isLinksActive) {
    turnOffLinks();
  } else {
    turnOnLinks();
  }
};

window.onload = function () {
  rangy.init();

  tagApplier = rangy.createCssClassApplier("tag", {
    elementTagName: "osc-tag",
    elementProperties: {
      title: "New Tag"
    }
  });
};

document.onmouseup = function () {
  var selection = rangy.getSelection();
  console.log(selection);
  console.log(selection.toString());

  //tagApplier.toggleSelection();

  //return false;
};

window.onbeforeunload = checkUnsaved;

// send message from content script to popup (TODO: or background page?)
chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
  console.log(response);
});

chrome.storage.sync.set({isLinksDisabled: false}, function () {
  console.log("set isLinksDisabled to false.")
});

// listen for message from popup (TODO: or background page?), and send response
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  /* If the received message has the expected format... */
  if (msg.text && (msg.text == "report_back")) {
    /* Call the specified callback, passing
     the web-pages DOM content as argument */
    sendResponse(document.all[0].outerHTML);
  }
});