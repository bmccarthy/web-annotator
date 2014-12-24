var createModal2 = function () {
  var modal =
    '<div id="web-annotator-modal" class="modal" style="display: none;text-align: left;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1040;overflow: hidden;-webkit-overflow-scrolling: touch;outline: 0;">' +
    '<div class="modal-backdrop close" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;float: right;font-size: 21px;font-weight: 700;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;filter: alpha(opacity=20);opacity: .2;position: absolute;top: 0;right: 0;left: 0;background-color: #000;"></div>' +
    '<div class="modal-dialog" style="width: 500px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;margin: 10px;">' +
    '<form novalidate style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">' +
    '<div class="modal-content" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;background-color: #fff;-webkit-background-clip: padding-box;background-clip: padding-box;border: 1px solid rgba(0,0,0,.2);border-radius: 6px;outline: 0;-webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);box-shadow: 0 5px 15px rgba(0,0,0,.5);">' +
    '<div class="modal-header" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;min-height: 16.43px;padding: 15px;border-bottom: 1px solid #e5e5e5;">' +
    '<button type="button" class="close" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font: inherit;color: #000;overflow: visible;text-transform: none;-webkit-appearance: none;cursor: pointer;font-family: inherit;font-size: 21px;line-height: 1;float: right;font-weight: 700;text-shadow: 0 1px 0 #fff;filter: alpha(opacity=20);opacity: .2;padding: 0;background: 0 0;border: 0;margin-top: -2px;"><span style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">×</span></button>' +
    '<h4 class="modal-title" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;font-family: inherit;font-weight: 500;line-height: 1.42857143;color: inherit;margin-top: 10px;margin-bottom: 10px;font-size: 18px;margin: 0;">New Tag</h4>' +
    '</div>' +
    '<div class="modal-body" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;padding: 15px;">' +
    '<form role="form" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">' +
    '<div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;">' +
    '<input id="web-annotator-input" type="text" class="form-control" readonly disabled style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font: inherit;color: #555;line-height: 1.42857143;font-family: inherit;font-size: 14px;display: block;width: 100%;height: 34px;padding: 6px 12px;background-color: #eee;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;cursor: not-allowed;opacity: 1;">' +
    '</div>' +
    '<div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;">' +
    '<select id="web-annotator-tags" class="form-control" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font: inherit;color: #555;text-transform: none;font-family: inherit;font-size: 14px;line-height: 1.42857143;display: block;width: 100%;height: 34px;padding: 6px 12px;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;background: #fff!important;"></select>' +
    '</div>' +
    '<div class="checkbox" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;display: block;margin-top: 10px;margin-bottom: 10px;">' +
    '<label style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 0;font-weight: 400;min-height: 20px;padding-left: 20px;cursor: pointer;">' +
    '<input id="web-annotator-show-preview" type="checkbox" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 4px 0 0;font: inherit;color: inherit;line-height: normal;font-family: inherit;font-size: inherit;padding: 0;margin-top: 4px \9;position: absolute;margin-left: -20px;"> Show Preview?' +
    '</label>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '<div class="modal-footer" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 15px;text-align: right;border-top: 1px solid #e5e5e5;">' +
    '<button type="button" class="btn btn-default close" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font: inherit;color: #000;overflow: visible;text-transform: none;-webkit-appearance: none;cursor: pointer;font-family: inherit;font-size: 21px;line-height: 1;display: inline-block;padding: 0;margin-bottom: 0;font-weight: 700;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 0;border-radius: 4px;background-color: #fff;border-color: #ccc;float: right;text-shadow: 0 1px 0 #fff;filter: alpha(opacity=20);opacity: .2;background: 0 0;">Close</button>' +
    '<button id="web-annotator-submit" type="button" class="btn btn-primary" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font: inherit;color: #fff;overflow: visible;text-transform: none;-webkit-appearance: button;cursor: pointer;font-family: inherit;font-size: 14px;line-height: 1.42857143;display: inline-block;padding: 6px 12px;margin-bottom: 0;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius: 4px;background-color: #337ab7;border-color: #2e6da4;margin-left: 5px;">Tag</button>' +
    '</div>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>';

  return modal;
};
