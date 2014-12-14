var createModal = function () {

  var div_webAnnotatorModal = document.createElement('div');
  div_webAnnotatorModal.style.display = "none";
  div_webAnnotatorModal.style.WebkitBoxSizing = "border-box";
  div_webAnnotatorModal.style.MozBoxSizing = "border-box";
  div_webAnnotatorModal.style.boxSizing = "border-box";
  div_webAnnotatorModal.style.position = "fixed";
  div_webAnnotatorModal.style.top = 0;
  div_webAnnotatorModal.style.right = 0;
  div_webAnnotatorModal.style.bottom = 0;
  div_webAnnotatorModal.style.left = 0;
  div_webAnnotatorModal.style.zIndex = 1040;
  div_webAnnotatorModal.style.overflow = "hidden";
  div_webAnnotatorModal.style.WebkitOverflowScrolling = "touch";
  div_webAnnotatorModal.style.outline = 0;
  div_webAnnotatorModal.id = "web-annotator-modal";

  var div_0 = document.createElement('div');
  div_0.style.WebkitBoxSizing = "border-box";
  div_0.style.MozBoxSizing = "border-box";
  div_0.style.boxSizing = "border-box";
  div_0.style.position = "absolute";
  div_0.style.top = 0;
  div_0.style.right = 0;
  div_0.style.left = 0;
  div_0.style.backgroundColor = "#000";
  div_0.onclick = function(){
    document.getElementById('web-annotator-modal').style.display = 'none'
  };
  div_webAnnotatorModal.appendChild( div_0 );


  var div_1 = document.createElement('div');
  div_1.style.width = "500px";
  div_1.style.WebkitBoxSizing = "border-box";
  div_1.style.MozBoxSizing = "border-box";
  div_1.style.boxSizing = "border-box";
  div_1.style.position = "relative";
  div_1.style.margin = "10px";

  var div_2 = document.createElement('div');
  div_2.style.WebkitBoxSizing = "border-box";
  div_2.style.MozBoxSizing = "border-box";
  div_2.style.boxSizing = "border-box";
  div_2.style.position = "relative";
  div_2.style.backgroundColor = "#fff";
  div_2.style.WebkitBackgroundClip = "padding-box";
  div_2.style.backgroundClip = "padding-box";
  div_2.style.border = "1px solid rgba(0,0,0,.2)";
  div_2.style.borderRadius = "6px";
  div_2.style.outline = 0;
  div_2.style.WebkitBoxShadow = "0 5px 15px rgba(0,0,0,.5)";
  div_2.style.boxShadow = "0 5px 15px rgba(0,0,0,.5)";

  var div_3 = document.createElement('div');
  div_3.style.WebkitBoxSizing = "border-box";
  div_3.style.MozBoxSizing = "border-box";
  div_3.style.boxSizing = "border-box";
  div_3.style.minHeight = "16.43px";
  div_3.style.padding = "15px";
  div_3.style.borderBottom = "1px solid #e5e5e5";

  var button_0 = document.createElement('button');
  button_0.style.WebkitBoxSizing = "border-box";
  button_0.style.MozBoxSizing = "border-box";
  button_0.style.boxSizing = "border-box";
  button_0.style.margin = 0;
  button_0.style.font = "inherit";
  button_0.style.color = "#000";
  button_0.style.overflow = "visible";
  button_0.style.textTransform = "none";
  button_0.style.WebkitAppearance = "none";
  button_0.style.cursor = "pointer";
  button_0.style.fontFamily = "inherit";
  button_0.style.fontSize = "21px";
  button_0.style.lineHeight = 1;
  button_0.style.float = "right";
  button_0.style.fontWeight = 700;
  button_0.style.textShadow = "0 1px 0 #fff";
  button_0.style.filter = "alpha(opacity=20)";
  button_0.style.opacity = ".2";
  button_0.style.padding = 0;
  button_0.style.background = "0 0";
  button_0.style.border = 0;
  button_0.style.marginTop = "-2px";
  button_0.onclick = function(){
    document.getElementById('web-annotator-modal').style.display = 'none'
  };
  button_0.type = "button";

  var span_0 = document.createElement('span');
  span_0.style.WebkitBoxSizing = "border-box";
  span_0.style.MozBoxSizing = "border-box";
  span_0.style.boxSizing = "border-box";
  span_0.appendChild( document.createTextNode("x") );
  button_0.appendChild( span_0 );

  div_3.appendChild( button_0 );


  var h4_0 = document.createElement('h4');
  h4_0.style.WebkitBoxSizing = "border-box";
  h4_0.style.MozBoxSizing = "border-box";
  h4_0.style.boxSizing = "border-box";
  h4_0.style.fontFamily = "inherit";
  h4_0.style.fontWeight = 500;
  h4_0.style.lineHeight = 1.42857143;
  h4_0.style.color = "inherit";
  h4_0.style.marginTop = "10px";
  h4_0.style.marginBottom = "10px";
  h4_0.style.fontSize = "18px";
  h4_0.style.margin = 0;
  h4_0.appendChild( document.createTextNode("New Tag") );
  div_3.appendChild( h4_0 );

  div_2.appendChild( div_3 );


  var div_4 = document.createElement('div');
  div_4.style.WebkitBoxSizing = "border-box";
  div_4.style.MozBoxSizing = "border-box";
  div_4.style.boxSizing = "border-box";
  div_4.style.position = "relative";
  div_4.style.padding = "15px";

  var form_0 = document.createElement('form');
  form_0.style.WebkitBoxSizing = "border-box";
  form_0.style.MozBoxSizing = "border-box";
  form_0.style.boxSizing = "border-box";
  form_0.role = "form";

  var div_5 = document.createElement('div');
  div_5.style.WebkitBoxSizing = "border-box";
  div_5.style.MozBoxSizing = "border-box";
  div_5.style.boxSizing = "border-box";
  div_5.style.marginBottom = "15px";

  var input_webAnnotatorInput = document.createElement('input');
  input_webAnnotatorInput.disabled = "disabled";
  input_webAnnotatorInput.readOnly = "readonly";
  input_webAnnotatorInput.style.WebkitBoxSizing = "border-box";
  input_webAnnotatorInput.style.MozBoxSizing = "border-box";
  input_webAnnotatorInput.style.boxSizing = "border-box";
  input_webAnnotatorInput.style.margin = 0;
  input_webAnnotatorInput.style.font = "inherit";
  input_webAnnotatorInput.style.color = "#555";
  input_webAnnotatorInput.style.lineHeight = 1.42857143;
  input_webAnnotatorInput.style.fontFamily = "inherit";
  input_webAnnotatorInput.style.fontSize = "14px";
  input_webAnnotatorInput.style.display = "block";
  input_webAnnotatorInput.style.width = "100%";
  input_webAnnotatorInput.style.height = "34px";
  input_webAnnotatorInput.style.padding = "6px 12px";
  input_webAnnotatorInput.style.backgroundColor = "#eee";
  input_webAnnotatorInput.style.backgroundImage = "none";
  input_webAnnotatorInput.style.border = "1px solid #ccc";
  input_webAnnotatorInput.style.borderRadius = "4px";
  input_webAnnotatorInput.style.WebkitBoxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
  input_webAnnotatorInput.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
  input_webAnnotatorInput.style.WebkitTransition = "border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s";
  input_webAnnotatorInput.style.OTransition = "border-color ease-in-out .15s,box-shadow ease-in-out .15s";
  input_webAnnotatorInput.style.transition = "border-color ease-in-out .15s,box-shadow ease-in-out .15s";
  input_webAnnotatorInput.style.cursor = "not-allowed";
  input_webAnnotatorInput.style.opacity = 1;
  input_webAnnotatorInput.type = "text";
  input_webAnnotatorInput.id = "web-annotator-input";
  div_5.appendChild( input_webAnnotatorInput );

  form_0.appendChild( div_5 );


  var div_6 = document.createElement('div');
  div_6.style.WebkitBoxSizing = "border-box";
  div_6.style.MozBoxSizing = "border-box";
  div_6.style.boxSizing = "border-box";
  div_6.style.marginBottom = "15px";

  var select_webAnnotatorTags = document.createElement('select');
  select_webAnnotatorTags.style.WebkitBoxSizing = "border-box";
  select_webAnnotatorTags.style.MozBoxSizing = "border-box";
  select_webAnnotatorTags.style.boxSizing = "border-box";
  select_webAnnotatorTags.style.margin = 0;
  select_webAnnotatorTags.style.font = "inherit";
  select_webAnnotatorTags.style.color = "#555";
  select_webAnnotatorTags.style.textTransform = "none";
  select_webAnnotatorTags.style.fontFamily = "inherit";
  select_webAnnotatorTags.style.fontSize = "14px";
  select_webAnnotatorTags.style.lineHeight = 1.42857143;
  select_webAnnotatorTags.style.display = "block";
  select_webAnnotatorTags.style.width = "100%";
  select_webAnnotatorTags.style.height = "34px";
  select_webAnnotatorTags.style.padding = "6px 12px";
  select_webAnnotatorTags.style.backgroundColor = "#fff";
  select_webAnnotatorTags.style.backgroundImage = "none";
  select_webAnnotatorTags.style.border = "1px solid #ccc";
  select_webAnnotatorTags.style.borderRadius = "4px";
  select_webAnnotatorTags.style.WebkitBoxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
  select_webAnnotatorTags.style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)";
  select_webAnnotatorTags.style.WebkitTransition = "border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s";
  select_webAnnotatorTags.style.OTransition = "border-color ease-in-out .15s,box-shadow ease-in-out .15s";
  select_webAnnotatorTags.style.transition = "border-color ease-in-out .15s,box-shadow ease-in-out .15s";
  select_webAnnotatorTags.style.background = "#fff!important";
  select_webAnnotatorTags.id = "web-annotator-tags";

  var option_0 = document.createElement('option');
  option_0.style.WebkitBoxSizing = "border-box";
  option_0.style.MozBoxSizing = "border-box";
  option_0.style.boxSizing = "border-box";
  option_0.appendChild( document.createTextNode("Tag 1") );
  select_webAnnotatorTags.appendChild( option_0 );


  var option_1 = document.createElement('option');
  option_1.style.WebkitBoxSizing = "border-box";
  option_1.style.MozBoxSizing = "border-box";
  option_1.style.boxSizing = "border-box";
  option_1.appendChild( document.createTextNode("Tag 2") );
  select_webAnnotatorTags.appendChild( option_1 );


  var option_2 = document.createElement('option');
  option_2.style.WebkitBoxSizing = "border-box";
  option_2.style.MozBoxSizing = "border-box";
  option_2.style.boxSizing = "border-box";
  option_2.appendChild( document.createTextNode("Tag 3") );
  select_webAnnotatorTags.appendChild( option_2 );

  div_6.appendChild( select_webAnnotatorTags );

  form_0.appendChild( div_6 );


  var div_7 = document.createElement('div');
  div_7.style.WebkitBoxSizing = "border-box";
  div_7.style.MozBoxSizing = "border-box";
  div_7.style.boxSizing = "border-box";
  div_7.style.position = "relative";
  div_7.style.display = "block";
  div_7.style.marginTop = "10px";
  div_7.style.marginBottom = "10px";

  var label_0 = document.createElement('label');
  label_0.style.WebkitBoxSizing = "border-box";
  label_0.style.MozBoxSizing = "border-box";
  label_0.style.boxSizing = "border-box";
  label_0.style.display = "inline-block";
  label_0.style.maxWidth = "100%";
  label_0.style.marginBottom = 0;
  label_0.style.fontWeight = 400;
  label_0.style.minHeight = "20px";
  label_0.style.paddingLeft = "20px";
  label_0.style.cursor = "pointer";

  var input_webAnnotatorShowPreview = document.createElement('input');
  input_webAnnotatorShowPreview.style.WebkitBoxSizing = "border-box";
  input_webAnnotatorShowPreview.style.MozBoxSizing = "border-box";
  input_webAnnotatorShowPreview.style.boxSizing = "border-box";
  input_webAnnotatorShowPreview.style.margin = "4px 0 0";
  input_webAnnotatorShowPreview.style.font = "inherit";
  input_webAnnotatorShowPreview.style.color = "inherit";
  input_webAnnotatorShowPreview.style.lineHeight = "normal";
  input_webAnnotatorShowPreview.style.fontFamily = "inherit";
  input_webAnnotatorShowPreview.style.fontSize = "inherit";
  input_webAnnotatorShowPreview.style.padding = 0;
  input_webAnnotatorShowPreview.style.marginTop = "4px";
  input_webAnnotatorShowPreview.style.position = "absolute";
  input_webAnnotatorShowPreview.style.marginLeft = "-20px";
  input_webAnnotatorShowPreview.type = "checkbox";
  input_webAnnotatorShowPreview.id = "web-annotator-show-preview";
  label_0.appendChild( input_webAnnotatorShowPreview );

  label_0.appendChild( document.createTextNode(" Show Preview?") );
  div_7.appendChild( label_0 );

  form_0.appendChild( div_7 );

  div_4.appendChild( form_0 );

  div_2.appendChild( div_4 );


  var div_8 = document.createElement('div');
  div_8.style.WebkitBoxSizing = "border-box";
  div_8.style.MozBoxSizing = "border-box";
  div_8.style.boxSizing = "border-box";
  div_8.style.padding = "15px";
  div_8.style.textAlign = "right";
  div_8.style.borderTop = "1px solid #e5e5e5";

  var button_1 = document.createElement('button');
  button_1.style.WebkitBoxSizing = "border-box";
  button_1.style.MozBoxSizing = "border-box";
  button_1.style.boxSizing = "border-box";
  button_1.style.margin = 0;
  button_1.style.font = "inherit";
  button_1.style.color = "#333";
  button_1.style.overflow = "visible";
  button_1.style.textTransform = "none";
  button_1.style.WebkitAppearance = "button";
  button_1.style.cursor = "pointer";
  button_1.style.fontFamily = "inherit";
  button_1.style.fontSize = "14px";
  button_1.style.lineHeight = 1.42857143;
  button_1.style.display = "inline-block";
  button_1.style.padding = "6px 12px";
  button_1.style.marginBottom = 0;
  button_1.style.fontWeight = 400;
  button_1.style.textAlign = "center";
  button_1.style.whiteSpace = "nowrap";
  button_1.style.verticalAlign = "middle";
  button_1.style.MsTouchAction = "manipulation";
  button_1.style.touchAction = "manipulation";
  button_1.style.WebkitUserSelect = "none";
  button_1.style.MozUserSelect = "none";
  button_1.style.MsUserSelect = "none";
  button_1.style.userSelect = "none";
  button_1.style.backgroundImage = "none";
  button_1.style.border = "1px solid transparent";
  button_1.style.borderRadius = "4px";
  button_1.style.backgroundColor = "#fff";
  button_1.style.borderColor = "#ccc";
  button_1.onclick = function(){
    document.getElementById('web-annotator-modal').style.display = 'none'
  };
  button_1.type = "button";
  button_1.appendChild( document.createTextNode("Close") );
  div_8.appendChild( button_1 );


  var button_2 = document.createElement('button');
  button_2.style.WebkitBoxSizing = "border-box";
  button_2.style.MozBoxSizing = "border-box";
  button_2.style.boxSizing = "border-box";
  button_2.style.margin = 0;
  button_2.style.font = "inherit";
  button_2.style.color = "#fff";
  button_2.style.overflow = "visible";
  button_2.style.textTransform = "none";
  button_2.style.WebkitAppearance = "button";
  button_2.style.cursor = "pointer";
  button_2.style.fontFamily = "inherit";
  button_2.style.fontSize = "14px";
  button_2.style.lineHeight = 1.42857143;
  button_2.style.display = "inline-block";
  button_2.style.padding = "6px 12px";
  button_2.style.marginBottom = 0;
  button_2.style.fontWeight = 400;
  button_2.style.textAlign = "center";
  button_2.style.whiteSpace = "nowrap";
  button_2.style.verticalAlign = "middle";
  button_2.style.MsTouchAction = "manipulation";
  button_2.style.touchAction = "manipulation";
  button_2.style.WebkitUserSelect = "none";
  button_2.style.MozUserSelect = "none";
  button_2.style.MsUserSelect = "none";
  button_2.style.userSelect = "none";
  button_2.style.backgroundImage = "none";
  button_2.style.border = "1px solid transparent";
  button_2.style.borderRadius = "4px";
  button_2.style.backgroundColor = "#337ab7";
  button_2.style.borderColor = "#2e6da4";
  button_2.style.marginLeft = "5px";
  button_2.onclick = function(){
    document.getElementById('web-annotator-modal').style.display = 'none'
  };
  button_2.type = "button";
  button_2.appendChild( document.createTextNode("Tag") );
  div_8.appendChild( button_2 );

  div_2.appendChild( div_8 );

  div_1.appendChild( div_2 );

  div_webAnnotatorModal.appendChild( div_1 );

  document.body.appendChild( div_webAnnotatorModal );


}