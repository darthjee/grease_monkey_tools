(function($){
  
  var $css = $('head #menu-css');
  
  if ($css.length == 0)
  {
    var cssTxt = '#grst-window\n{\n  position:relative;\n  top:0px;\n  right:0px;\n}\n\n.GMS-Menu\n{\n  position:fixed;\n  top:40px;\n  right:10px;\n}\n\n.GMS-Menu input[type="text"],.GMS-Menu textarea\n{\n  width:250px;\n}\n\n.GMS-Menu .GM-wings-menu .GM-menu-btn\n{\n  float:left;\n  margin-right:5px;\n  cursor:pointer;\n  background:#000;\n  color:#fff;\n  font-weight:bold;\n  padding: 1px 3px;\n}\n.GMS-Menu .GM-wings-menu .GM-menu-btn:hover\n{\n  background:#8bf;\n  color:#000;\n}\n.GMS-Menu .GM-wings-menu .GM-menu-btn.active\n{\n  background:#47d;\n  color:#000;\n}\n\ndiv.GMS-Menu\n{\n  background:#47d;\n  padding:2px;\n}\ndiv.GMS-Menu .GM-wings-menu\n{\n  height:23px;\n  overflow:hidden;\n}\n\n.GM-body label, .label\n{\n  color:black;\n  font-size:12px;\n}\n\n.GM-body li.link\n{\n  cursor:pointer;\n}\n.GM-body li.link:hover\n{\n  background:#000;\n  color:#47d;\n}\n\n.GM-body h3.selected\n{\n  padding:2px;\n  font-weight:bold;\n  background:#8bf;\n}\n\n.status span\n{\n  display:none;\n}\n\n.status.ativo span.ativo,\n.status.inativo span.inativo\n{\n  display:inline;\n  font-weight:bold;\n}\n\n.status.inativo\n{\n  background:red;\n  color:black;\n}\n.status.ativo\n{\n  background:green;\n  color:white;\n}\n\nul.no-bullets\n{\n  padding-left:10px;\n}\n\nul.no-bullets li\n{\n  display:block;\n}';
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
  

  menu.add($.fn.menu.copamais.reloader());
  //menu.add($.fn.menu.todo.tclock());
  menu.add($.fn.menu.colapser());
  menu.add($.fn.menu.close);
  menu.add($.fn.menu.config);
  if ($('#grst-window').length > 0)
    menu.add($.fn.menu.wing({
      btnTitle:'scrpt',
      div:$('#grst-window')
    }));
  menu.settings.menus.find('div:first:visible').click();
})($jq);
