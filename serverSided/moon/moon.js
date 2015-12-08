(function($){
  var $css = $('head #menu-css');

  if ($css.length == 0)
  {
    $css = $('<link href="http://scripts.favinis.net/serverSided/moon/moon-menu.css" media="all" rel="stylesheet" />');
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

  menu.add($.fn.menu.moon.precolandia());
  menu.add($.fn.menu.moon.pontofrio());
  menu.settings.menus.find('div:first').click();
})($jq);
