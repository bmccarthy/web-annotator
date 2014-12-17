(function () {
  'use strict';

  var hasBeenInit = false;
  var allTagAppliers = {};

  var isActive, showPreview, isLinksActive;
  var currentProject;

  try {
    rangy.init();
  }
  catch(e){
    console.log(e);
  }

  var updateTags = function () {
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

    var options = "";
    allTagAppliers = {};

    if (currentProject != null) {
      $.each(currentProject.tags, function (i, item) {
        options += "<option>" + item.name + "</option>";

        sheet.insertRule("web-annotator[tag='" + item.name + "'] { background-color: " + item.color + " !important; opacity: 0.8 !important; }", 0);

        /*        allTagAppliers[item.name] = rangy.createCssClassApplier("tag", {
         elementTagName: "web-annotator",
         elementProperties: {
         title: item.name
         },
         elementAttributes: {
         tag: item.name
         }
         });*/
      });
    }

    $("#web-annotator-tags").html(options);
  };

  chrome.storage.sync.get("isActive", function(data){
    isActive = data.isActive || false;
  });

  chrome.storage.sync.get("showPreview", function(data){
    showPreview = data.showPreview || true;
  });

  chrome.storage.sync.get("isLinksActive", function(data){
    isLinksActive = data.isLinksActive || true;
  });

  chrome.storage.sync.get("projects", function (data) {
    var projects = data.projects || [];

    // get the current project id after the projects have all been retrieved.
    chrome.storage.sync.get("currentProjectId", function (currentProjData) {
      var currentProjectId = currentProjData.currentProjectId;

      if (currentProjectId != null) {
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === currentProjectId) {
            currentProject = projects[i];
            break;
          }
        }
      }

      updateTags();
    });
  });

  chrome.storage.onChanged.addListener(function (changes) {
    for (var key in changes) {
      var storageChange = changes[key];

      if (key === "isActive") {
        isActive = storageChange.newValue;
      } else if(key === "showPreview") {
        showPreview = storageChange.newValue;
      } else if (key === "isLinksActive") {
        isLinksActive = storageChange.newValue;
      } else if(key === "currentProjectId") {
        console.log("content script: project changed!")
      }
    }

    console.log("chrome storage updated in content script: " + JSON.stringify(changes));
  });

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("message recieved in content script: " + JSON.stringify(msg));

    if (!msg.type) {
      return;
    }

    if (msg.type === "report_back") {
      sendResponse(document.all[0].outerHTML);
    } else if (msg.type === "update_project") {
      currentProject = msg.data;
      updateTags();
    }
  });

  $("#web-annotator-show-preview").on("change", function (e) {
    var showPreview = e.originalEvent.target.checked;
    chrome.storage.sync.set({showPreview: showPreview});
  });

  var tagCurrentText = function () {
    var currentTag = $("#web-annotator-tags option:selected").text();
    if (currentTag == null || currentTag == "") {
      return;
    }

    if (allTagAppliers[currentTag] != null) {
      allTagAppliers[currentTag].applyToSelection();
    }
  };

  $("#web-annotator-submit").on("click", function (e) {
    e.preventDefault();
    tagCurrentText();
  });

  $("#web-annotator-modal .close").on("click", function (e) {
    e.preventDefault();
    $("#web-annotator-modal").hide();
  });

  document.onmouseup = function (e) {
    // we don't want to overwrite the target tag when selecting text in the modal popup
    if ($(e.target).closest("#web-annotator-modal").length > 0) {
      return;
    }

    var selection = rangy.getSelection();
    var selectionString = selection.toString();

    if (selectionString.trim() == "") {
      return;
    }

    chrome.storage.sync.get("isActive", function (data) {
      var isActive = data.isActive || false;

      if (isActive === false) {
        return;
      }

      if (hasBeenInit === false) {
        createModal();
        hasBeenInit = true;
      }

      chrome.storage.sync.get("showPreview", function (data) {
        var showPreview = data.showPreview || true;

        if (showPreview) {
          //$("#web-annotator-show-preview").prop("checked", showPreview);
          document.getElementById("web-annotator-input").value = selectionString;
          $("#web-annotator-modal").show();
        } else {
          tagCurrentText();
        }
      });
    });
  };
})();
