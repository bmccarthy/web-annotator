(function ($, rangy) {
  'use strict';

  var hasBeenInit = false,
    allTagAppliers = {},
    currentProject,
    currentTag,
    $webAnnotatorFrame,
    isLinksActive = true,
    currentTagId = 0;

  var extensionUrl = chrome.extension.getURL('');
  if (extensionUrl.charAt(extensionUrl.length - 1) === '/') {
    extensionUrl = extensionUrl.slice(0, -1);
  }

  /**
   * Handles responding to chrome extension messages sent from the background page.
   * @param msg
   * @param sender
   * @param sendResponse
   */
  function handleChromeMessage(msg, sender, sendResponse) {
    if (!msg.type) {
      return;
    }

    switch (msg.type) {
      case 'get_isLinksActive':
        sendResponse(isLinksActive);
        break;
      case 'get_html':
        var html = document.documentElement.outerHTML;
        sendResponse(html);
        break;
      case 'deactivate':
        currentProject = null;
        deactivate();
        break;
      case 'project_changed':
        currentProject = msg.project;
        updateStyles();
        break;
      case 'activate':
        currentProject = msg.project;
        break;
      case 'isLinksActive_changed':
        isLinksActive = msg.isLinksActive;
        toggleIsLinksActive();
        break;
      default:
        console.log('unknown message: ' + JSON.stringify(msg));
        break;
    }
  }

  function toggleIsLinksActive() {
    if (isLinksActive === false) {
      $('a[href]').each(function () {
        $(this).attr('href-web-annotator', $(this).attr('href')).removeAttr('href');
      });
    } else {
      $('a[href-web-annotator]').each(function () {
        $(this).attr('href', $(this).attr('href-web-annotator')).removeAttr('href-web-annotator');
      });
    }
  }

  /**
   * Updates the dynamic CSS styles for the page to display the correct highlights for the web annotations
   */
  function updateStyles() {
    if (hasBeenInit === false) {
      return;
    }

    var tags = [];

    if (currentProject && currentProject.tags) {
      tags = currentProject.tags;
    }

    // after updating the modal dialog options, add the css styles to the page
    var sheet = document.getElementById('web-annotator-styles');
    if (sheet) {
      sheet.parentNode.removeChild(sheet);
    }

    sheet = (function () {
      var style = document.createElement('style');
      style.setAttribute('media', 'screen');
      style.setAttribute('id', 'web-annotator-styles');

      document.head.appendChild(style);
      return style.sheet;
    })();

    allTagAppliers = {};

    sheet.insertRule('web-annotation { cursor: pointer; }', 0);

    $.each(tags, function (i, item) {

      sheet.insertRule('web-annotation[tag="' + item.name + '"] { background-color: ' + item.color + ' !important; opacity: 0.8 !important; }', 0);

      allTagAppliers[item.name] = rangy.createClassApplier('tag', {
        elementTagName: 'web-annotation',
        elementProperties: {
          title: item.name
        },
        elementAttributes: {
          tag: item.name
        },
        onElementCreate: function (el) {
          $(el).attr('annotation-id', currentTagId);
        }
      });
    });
  }

  function hideModal() {
    $webAnnotatorFrame.css('display', 'none');
    $('body').css('overflow', 'auto');
  }

  function showModal() {
    $('body').css('overflow', 'hidden');
    $webAnnotatorFrame.css('display', 'block');
  }

  /**
   * Tag the currently selected text with the tag. This wraps the selected text with the <web-annotation> tag.
   * @param tag
   */
  function tagCurrentText(tag) {

    if (!tag || tag === '') {
      return;
    }

    if (!allTagAppliers || !allTagAppliers[tag]) {
      throw new Error('tag css class applier not found!');
    }

    currentTagId++;
    //TODO: don't apply to current selection since this may have changed. Have it take in a set of ranges and apply to that.
    allTagAppliers[tag].applyToSelection();
  }

  function initialize() {
    if (hasBeenInit === true) {
      return;
    } else {
      hasBeenInit = true;
    }

    rangy.init();

    updateStyles();

    var frameStyle = 'width:100%; height: 100%; position: fixed; top:0;bottom:0;right:0;left:0; border:none; margin:0; background-color: transparent; overflow: hidden; z-index: 2147483647; display:none;';
    var iframe = $('<iframe id="web-annotator-frame" style="' + frameStyle + '" frameborder="0" allowTransparency="true"></iframe>');
    iframe.attr('src', chrome.extension.getURL('web-annotator-modal-ng.html') + '?url=' + document.location.origin);

    $('body').append(iframe);

    $webAnnotatorFrame = $('#web-annotator-frame');

    $('body').on('keyup', function (e) {
      // hide the modal on escape
      if (e.keyCode === 27) {
        hideModal();
      }
    });

    // listen for all events from the iframe
    window.addEventListener('message', function (e) {
      if (e.origin !== extensionUrl) {
        return;
      }

      if (e.data.newAnnotation) {
        currentTag = e.data.newAnnotation.tag;
        tagCurrentText(e.data.newAnnotation.tag);
      }

      if (e.data.editAnnotation) {
        $('web-annotation[annotation-id=' + e.data.editAnnotation.annotationId + ']')
          .attr('tag', e.data.editAnnotation.tag)
          .attr('title', e.data.editAnnotation.tag);
      }

      if (e.data.deleteAnnotation) {
        $('web-annotation[annotation-id=' + e.data.deleteAnnotation.annotationId + ']')
          .contents()
          .unwrap();
      }

      hideModal();
    }, false);
  }

  function handleMouseUp(e) {
    // ignore new selections if the mouse up key is not pressed, this helps prevent accidently displaying the modal
    if (e.ctrlKey !== true) {
      return;
    }

    if (!currentProject) {
      return;
    }

    if (hasBeenInit === false) {
      initialize();
    }

    if ($(e.target).is('web-annotation')) {
      var annotationId = $(e.target).attr('annotation-id');
      var annotationText = $('web-annotation[annotation-id=' + annotationId + ']').text();
      var annotationTag = $(e.target).attr('tag');

      chrome.storage.sync.get('showPreview', function (data) {
        var showPreview = data.showPreview === undefined || data.showPreview === true;

        $webAnnotatorFrame[0].contentWindow.postMessage({
          tags: currentProject.tags,
          currentTag: annotationTag,
          selectedText: annotationText,
          showPreview: showPreview,
          annotationId: annotationId,
          action: 'edit'
        }, extensionUrl);

        // actually display the modal by positioning and displaying the iframe
        showModal();
      });

      return;
    }

    var selection = rangy.getSelection();
    var selectionString = selection.toString();

    if (selectionString.trim() === '') {
      return;
    }

    chrome.storage.sync.get('showPreview', function (data) {
      var showPreview = data.showPreview === undefined || data.showPreview === true;

      if (showPreview === true || !currentTag || currentTag.trim() === '') {
        // set up the modal with the data it needs to display
        $webAnnotatorFrame[0].contentWindow.postMessage({
          tags: currentProject.tags,
          currentTag: currentTag,
          selectedText: selectionString,
          showPreview: showPreview
        }, extensionUrl);

        // actually display the modal by positioning and displaying the iframe
        showModal();
      } else {
        tagCurrentText(currentTag);
      }
    });
  }

  function deactivate() {
    if (hasBeenInit === false) {
      return;
    }
  }

  document.onmouseup = handleMouseUp;

  chrome.runtime.onMessage.addListener(handleChromeMessage);

  chrome.storage.sync.get('isActive', function (data) {
    if (data.isActive !== true) {
      return;
    }

    chrome.storage.sync.get('currentProjectId', function (currentProjectData) {
      if (!currentProjectData.currentProjectId) {
        return;
      }

      chrome.storage.sync.get('projects', function (projectsData) {
        if (!projectsData.projects) {
          return;
        }

        for (var i = 0; i < projectsData.projects.length; i++) {

          if (projectsData.projects[i].id === currentProjectData.currentProjectId) {
            currentProject = projectsData.projects[i];
            break;
          }
        }
      });
    });
  });

})(window.$, window.rangy);
