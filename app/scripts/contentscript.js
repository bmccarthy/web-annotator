'use strict';

var hasBeenInit = false,
  allTagAppliers = {},
  currentProject,
  currentTag;

var extensionUrl = chrome.extension.getURL("");
if (extensionUrl.charAt(extensionUrl.length - 1) === '/') {
  extensionUrl = extensionUrl.slice(0, -1);
}

var updateStyles = function () {
  if (hasBeenInit === false) {
    return;
  }

  var tags = [];

  if (currentProject != null && currentProject.tags != null) {
    tags = currentProject.tags;
  }

  // after updating the modal dialog options, add the css styles to the page
  var sheet = document.getElementById("web-annotator-styles");
  if (sheet) {
    sheet.parentNode.removeChild(sheet);
  }

  sheet = (function () {
    var style = document.createElement("style");
    style.setAttribute("media", "screen");
    style.setAttribute("id", "web-annotator-styles");

    document.head.appendChild(style);
    return style.sheet;
  })();

  allTagAppliers = {};

  $.each(tags, function (i, item) {

    sheet.insertRule("web-annotator[tag='" + item.name + "'] { background-color: " + item.color + " !important; opacity: 0.8 !important; }", 0);

    allTagAppliers[item.name] = rangy.createClassApplier("tag", {
      elementTagName: "web-annotator",
      elementProperties: {
        title: item.name
      },
      elementAttributes: {
        tag: item.name
      }
    });
  });
};

var hideModal = function () {
  $("#web-annotator-frame").css("display", "none");
};

var showModal = function () {
  var top = Math.max($(window).height() / 2 - 152, 0);
  var left = Math.max($(window).width() / 2 - 250, 0);

  $("#web-annotator-frame").css({
    display: "block",
    position: 'fixed',
    left: left + "px",
    top: top + "px"
  });
};

var tagCurrentText = function (tag) {

  console.log("tagging current text with current tag: " + tag);

  if (tag == null || tag == "") {
    return;
  }

  if (allTagAppliers == null || allTagAppliers[tag] == null) {
    throw Error("tag css class applier not found!");
  }

  allTagAppliers[tag].applyToSelection();
};

var handleMouseUp = function (e) {
  if (hasBeenInit === false) {
    return;
  }

  if (currentProject == null) {
    return;
  }

  var selection = rangy.getSelection();
  var selectionString = selection.toString();

  if (selectionString.trim() == "") {
    return;
  }

  chrome.storage.sync.get("isActive", function (data) {
    if (data.isActive === true) {

      chrome.storage.sync.get("showPreview", function (data) {
        var showPreview = data.showPreview == null || data.showPreview === true

        if (data.showPreview === true || currentTag == null || currentTag.trim() == "") {

          // update the tags and text of the popup
          var $webAnnotatorFrame = $("#web-annotator-frame");
          if ($webAnnotatorFrame.length == 0) {
            throw Error("Web Annotator Frame not loaded...");
          }

          $webAnnotatorFrame[0].contentWindow.postMessage({
            tags: currentProject.tags,
            currentTag: "",
            selectedText: selectionString
          }, extensionUrl);

          showModal();
        } else {
          tagCurrentText(currentTag);
        }
      });
    }
  });
};

var initialize = function () {
  if (hasBeenInit === true) {
    return;
  } else {
    hasBeenInit = true;
  }

  rangy.init();

  console.log("initializing web annotator: " + JSON.stringify(currentProject));

  updateStyles();

  var iframe = $("<iframe id='web-annotator-frame' style='width:500px; height: 304px; position: absolute; border:none; background-color: transparent; overflow: hidden; z-index: 99999; display:none;' frameborder='0' allowTransparency='true'></iframe>");
  iframe.attr("src", chrome.extension.getURL('web-annotator-modal.html'));
  $("body").append(iframe);

  $("body").on("keyup", function (e) {
    // hide the modal on escape
    if (e.keyCode == 27) {
      hideModal();
    }
  });

  document.onmouseup = handleMouseUp;
};

var deactivate = function () {
  if (hasBeenInit === false) {
    return;
  }

  console.log("deactivate web-annotator");
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log("message recieved in content script: " + JSON.stringify(msg));

  if (!msg.type) {
    return;
  }

  switch (msg.type) {
    case "report_back":
      sendResponse(document.all[0].outerHTML);
      break;
    case "deactivate":
      currentProject = null;
      deactivate();
      break;
    case "toggle_show_preview":
      $("#web-annotator-show-preview").prop("checked", msg.showPreview);
      break;
    case "project_changed":
      currentProject = msg.project;
      updateStyles();
      break;
    case "activate":
      currentProject = msg.project;
      initialize();
      break;
    default:
      console.log("unknown message: " + JSON.stringify(msg));
      break;
  }
});

// listen for all events from the iframe
window.addEventListener('message', function (e) {
  if (e.origin === extensionUrl) {
    console.log("message recieved from new annotation modal: ");
    console.log(e);

    if (e.data.newAnnotation != null) {
      currentTag = e.data.newAnnotation.tag;
      tagCurrentText(e.data.newAnnotation.tag);
    }

    hideModal();
  }
}, false);

chrome.storage.sync.get("isActive", function (data) {
  if (data.isActive !== true) {
    return;
  }

  chrome.storage.sync.get("currentProjectId", function (currentProjectData) {
    if (currentProjectData.currentProjectId == null) {
      return;
    }

    chrome.storage.sync.get("projects", function (projectsData) {
      if (projectsData.projects == null) {
        return;
      }

      for (var i = 0; i < projectsData.projects.length; i++) {

        if (projectsData.projects[i].id === currentProjectData.currentProjectId) {
          currentProject = projectsData.projects[i];
          initialize();
          break;
        }
      }
    });
  });
});
