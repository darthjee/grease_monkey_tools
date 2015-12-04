(function($){
  
  var $css = $('head #menu-css');
  
  if ($css.length == 0)
  {
    var cssTxt = '#grst-window\n{\n  position:relative;\n  top:0px;\n  right:0px;\n}\n\n.GMS-Menu\n{\n  position:absolute;\n  top:10px;\n  right:10px;\n}\n\n.GMS-Menu input[type="text"],.GMS-Menu textarea\n{\n  width:250px;\n}\n\n.GMS-Menu .GM-wings-menu .GM-menu-btn\n{\n  float:left;\n  margin-right:5px;\n  cursor:pointer;\n  background:#000;\n  color:#fff;\n  font-weight:bold;\n  padding: 1px 3px;\n}\n\ndiv.GMS-Menu\n{\n  background:#47d;\n  padding:2px;\n}\ndiv.GMS-Menu .GM-wings-menu\n{\n  height:23px;\n  overflow:hidden;\n}\n';
    $css = $('<style id="menu-css" type="text/css">'+cssTxt+'</style>');
    $('body').append($css);
  }
  
  
  var div = $('#GMS-Menu');
  if (div == null || div.length == 0)
    div = $('<div id="GMS-Menu" class="GMS-Menu"></div>');
  var wings = [];
  
  $('body').append(div);
  var menu = div.menu();
  div.show();
  menu.render();
  
  $('#grst-css').remove();
  div.attr('style','position:fixed;top:10px;right:10px;z-index:10;');
  
  
  menu.add($.fn.menu.wing({
    btnTitle:'scrpt',
    div:$('#grst-window')
  }));
  
  menu.add($.fn.menu.colapser());
})(jQuery);

