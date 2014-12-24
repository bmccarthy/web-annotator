(function () {
  var pageOrigin;

  $('#web-annotator-modal').on('submit', function () {

    var tag = $('#web-annotator-tag').val();
    var text = $('#web-annotator-input').val();

    var newAnnotation = {
      newAnnotation: {
        tag: tag,
        selectedText: text
      }
    };

    window.parent.postMessage(newAnnotation, pageOrigin);
  });

  $('.js-close').on('click', function (e) {
    window.parent.postMessage({}, pageOrigin);
  });

  $('body').on('keyup', function (e) {
    if (e.keyCode == 27) {
      window.parent.postMessage({}, pageOrigin);
    }
  });

  // listen for all events from the iframe
  window.addEventListener('message', function (e) {
    if (e.data == null) {
      return;
    }

    console.log('new tag annotation requested: ');
    console.log(e);

    if (e.data.tags != null) {

      var options = '';
      $.each(e.data.tags, function (i, item) {
        options += '<option>' + item.name + '</option>';
      });

      $('#web-annotator-tag').html(options);
    }

    if (e.data.currentTag != null) {
      if (e.data.currentTag.trim() !== '') {
        $('#web-annotator-tag').val(e.data.currentTag);
      }
    }

    if (e.data.selectedText != null) {
      $('#web-annotator-input').val(e.data.selectedText);
      pageOrigin = e.origin;
    }
  }, false);

  $('#web-annotator-modal').modal({backdrop: false, keyboard: false, show: true});
})();
