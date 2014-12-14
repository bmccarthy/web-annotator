(function () {
  'use strict';

  rangy.init();

  createModal();

  var isActive = false;
  var currentProject;
  var allTagAppliers = {};

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

        allTagAppliers[item.name] = rangy.createCssClassApplier("tag", {
          elementTagName: "web-annotator",
          elementProperties: {
            title: item.name
          },
          elementAttributes: {
            tag: item.name
          }
        });
      });
    }

    $("#web-annotator-tags").html(options);
  };

  var updateShowPreview = function (showPreview) {
    $("#web-annotator-show-preview").prop("checked", showPreview);
  };

  chrome.storage.sync.get("isActive", function (data) {
    isActive = data.isActive || false;
  });

  chrome.storage.sync.get("showPreview", function (data) {
    updateShowPreview(data.showPreview || false);
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

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("message recieved in content script: " + JSON.stringify(msg));

    if (!msg.type) {
      return;
    }

    if (msg.type === "report_back") {
      sendResponse(document.all[0].outerHTML);
    } else if (msg.type === "update_showPreview") {
      updateShowPreview(msg.data);
    } else if (msg.type === "update_isActive") {
      isActive = msg.data;
    } else if (msg.type === "update_project") {
      currentProject = msg.data;
      updateTags();
    }
  });

  document.onmouseup = function () {
    var selection = rangy.getSelection();
    var selectionString = selection.toString();

    if (selectionString.trim() == "" || isActive === false) {
      return;
    }

    if ($("#web-annotator-show-preview").is(":checked")) {
      document.getElementById("web-annotator-input").value = selectionString;
      document.getElementById("web-annotator-modal").style.display = "block";
    } else {
      var currentTag = $("#web-annotator-tags option:selected").text();
      if (currentTag == null || currentTag == "") {
        return;
      }
      allTagAppliers[currentTag].applyToSelection();
    }
  };
})();
