/**
 * @file facebook/jquery.gs.menu.js
 * @brief biblioteca para ser utilizado com o greasemonkey server sided scripts
 * para criacao de biliotecas
 * @version 1.1
 */

/**
 * @brief funcao de inicializacao
 */
(function($)
{
  var Menu = null;
  /**
   * @brief cria um controlador de menus
   */
  Menu = function (dom, options){
    if (this.constructor != Menu)
    {
      return new Menu(dom, options);
    }
    else
    {
      $dom = $(dom);
      var settings = {
        wings : [],
        menu:this,
        dom:$dom,
        menus:null,
        body:null,
        rendered:false
      };
      var data = $dom.data('menuObj');
      data = data ? data : {};
      data.settings = $.extend(settings,data.settings,options);
      this.settings = settings;
      $dom.data('menuObj', data);
    }
  };
  /**
   * @Renderiza o controlador de menus 
   */
  Menu.prototype.render = function(){
    var menu = this;
    var settings = this.settings;
    var $dom = settings.dom;
    $dom.html('');
    settings.menus = $('<div class="GM-wings-menu"></div>');
    settings.body = $('<div class="GM-body"></div>');
    $dom.append(settings.menus);
    $dom.append(settings.body);
    $(settings.wings).each(function(){
      this.render(menu);
    });
    if (settings.wings.length)
      settings.menus.find('div:first').click();
    settings.rendered = true;
  };
  /**
   * @brief esconde todos os menus
   */
  Menu.prototype.hideAll = function(){
    var $body = this.settings.body;
    $body.children().hide();
  };
  /**
   * @brief adciona um menu a lista de menus do controlador
   */
  Menu.prototype.add = function(wing)
  {
    var set =this.settings; 
    set.wings.push(wing);
    if (set.rendered)
    {
      wing.render(this);
      if (set.wings.length == 1)
        wing.show();
    }
  };
  
  
  
  /**
   * @brief constroi o objeto aba de menu
   * @param options
   * @returns {Menu.Wing}
   */
  Menu.Wing = function(options){
    if (this.constructor == Menu.Wing)
    {
      var settings = Menu.Wing.protoSettings();
      if (typeof options == "object" && options.constructor == Menu.Wing)
        options = options.settings;
      if (typeof settings == "object" && settings.constructor == Object)
        settings = $.extend(settings,options);
      this.settings = settings;
    }
    else
    {
      return new Menu.Wing(options);
    }
  };
  /**
   * @brief objeto de configuracao de uma aba de menu
   */
  Menu.Wing.protoSettings = function(){
    return {
      btnTitle:null,
      extraClass:'',
      btn:null,
      div:null,
      html:'',
      css:'',
      preCall:function(){},
      posCall:function(){},
      bind:function(){},
      render:function(){return true;},
      menu:null,
      rendered:false
    };
  };
  /**
   * @brief rendriza uma aba/objeto de menu
   */
  Menu.Wing.prototype.render = function(menu){
    var set = this.settings;
    menu = menu ? menu : set.menu;
    set.menu = menu;
    if (set.render())
      this.forceRender(menu);
  }
  Menu.Wing.prototype.forceRender = function(menu){
    var set = this.settings;
    menu = menu ? menu : set.menu;
    set.menu = menu;  
    var $div = set.div;
    var $btn = set.btn;
    
    if ($div == null)
    {
      $div = $('<div class="GM-menu-body '+set.extraClass+'">'+set.html+'</div>');
      set.div = $div;
    }
    if ($btn == null)
    {
      $btn = $('<div class="GM-menu-btn '+set.extraClass+'">'+set.btnTitle+'</div>');
      set.btn = $btn;
    }
    if (!set.rendered)
      this.bind();
    if (menu && menu.settings.menus)
      menu.settings.menus.append($btn);
    if (menu && menu.settings.body)
      menu.settings.body.append($div);
    if (set.css)
    {
      var $css = $('<style>'+set.css+'</style>');
      $('head').append($css);
    }
    $div.hide();
    set.rendered = true;
  };
  /**
   * @brief binda os eventos do menu
   */
  Menu.Wing.prototype.bind = function(){
    var set = this.settings;
    var $btn = set.btn;
    var menu = set.menu;
    var self = this;
    
    $btn.bind("click", function(){
      menu.hideAll();
      self.show();
      menu.settings.menus.find('div').removeClass('active');
      $btn.addClass('active');
    });
    set.bind.apply(set);
  };
  Menu.Wing.prototype.show = function(){
    if (this.settings.rendered)
      this.settings.div.show();
  };
  
  $.fn.menu = function(settings){
    return Menu(this.get(0), settings);
  };
  $.fn.menu.prototype = Menu.prototype;
  $.fn.menu.wing = function(settings){
    return Menu.Wing.call(null, settings);
  };
  $.fn.menu.wing.prototype = Menu.Wing.prototype;
})($jq);
