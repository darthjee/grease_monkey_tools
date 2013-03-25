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
			window.menus = window.menus ? window.menus : [];
			window.menus.push(this);
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
			if (this.renderCookie())
				this.render(menu);
		});
		$(settings.wings).each(function(){
			if (this.settings.rendered)
				this.posCall.aplly(this.settings);
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
	Menu.prototype.add = function(wing, render)
	{
		var set = this.settings; 
		set.wings.push(wing);
		if (!wing.settings.id){
			wing.settings.id = 'wing'+set.wings.length;
		}
		var cookie = wing.renderCookie();
		render = render != undefined ? render : cookie;
		if (set.rendered && !!render)
		{
			wing.render(this);
			if (set.wings.length == 1)
				wing.show();
			wing.settings.posCall.apply(wing.settings);
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
			id:null,
			btnTitle:null,
			extraClass:'',
			btn:null,
			div:null,
			html:'',
			css:'',
			preCall:function(){},
			posCall:function(){},
			view:function(){},
			preView:function(){},
			bind:function(){},
			render:function(){return true;},
			menu:null,
			rendered:false,
			config:{}
		};
	};
	/**
	 * @brief rendriza uma aba/objeto de menu
	 */
	Menu.Wing.prototype.render = function(menu){
		var set = this.settings;
		menu = menu ? menu : set.menu;
		set.menu = menu;
		if (set.render()){
			set.preCall();
			this.forceRender(menu);
		}
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
			set.preView.apply(set);
			menu.hideAll();
			self.show();
			menu.settings.menus.find('div').removeClass('active');
			$btn.addClass('active');
			set.view.apply(set);
		});
		set.bind.apply(set);
	};
	Menu.Wing.prototype.show = function(){
		if (this.settings.rendered)
			this.settings.div.show();
	};
	Menu.Wing.prototype.renderCookie = function(){
		var cookie = this.cookie('render');
		cookie = cookie != undefined ? !!Number(cookie) : true;
		return cookie;
	}
	Menu.Wing.prototype.cookie = function(key, value, options){
		var wing = this;
		var name = ['GS-Menu',wing.settings.id, key].join('-');
		return $.cookie(name, value, options);
	}
	
	Menu.Wing.Close = Menu.Wing({
		html:'<input type="hidden" id="gs-menu-close-closed" />',
		btnTitle:'Close',
		bind:function(){
			var $div = this.div;
			$div.find('#gs-menu-close-closed').cookiefy('gs-menu-close-closed', false, {path:'/'});
		},
		view:function(){
			var $div = this.div;
			this.closed = !this.closed;
			this.btn.text(this.closed ? 'Open' : 'Close');
			$div.find('#gs-menu-close-closed').val(this.closed ? true : false);
			$div.find('#gs-menu-close-closed').trigger('change');
			if (this.closed)
				this.btn.parent().children().hide();
			else
				this.btn.parent().children().show().filter(function(i){return !i}).click();
			this.btn.show();
		},
		posCall:function(){
			var $div = this.div;
			var closed = $div.find('#gs-menu-close-closed').val() == "true";
			if (closed)
				this.btn.click();
		},
		closed:false
	});
	
	
	Menu.Wing.Config = Menu.Wing({
		html:'',
		btnTitle : 'Conf',
		bind:function(){
			var $div = this.div;
			var menu = $div.menu();
			this.innerMenu = menu;
			menu.render();
			$(this.menu.settings.wings).each(function(){
				var settings = this.settings;
				var set = $.extend({}, settings, {
					btn:null,
					div:null,
					html:'',
					css:'',
					preCall:function(){},
					posCall:function(){},
					view:function(){},
					preView:function(){},
					bind:function(){},
					render:function(){return !!settings.config;},
					menu:null,
					rendered:false,
					configFor:this.settings
				}, this.settings.config);
				var wing = Menu.Wing(set);
				menu.add(wing);
			});
			menu.settings.menus.find('div:first').click();
		},
		view:function(){
			this.innerMenu.settings.menus.find('div.active').click();
		},
		config:{
			html:'<fieldset><legend>Apps:</legend><ul class="apps no-bullets"></ul></fieldset>',
			btnTitle : 'General',
			bind:function(){
				var controller = this;
				var menu = controller.configFor.menu.settings;
				var $div = controller.div;
				var wings = menu.wings;
				var $ul = $div.find('ul.apps');
				controller.rendered = true;
				$(wings).each(function(i){
					var id = this.settings.id;
					var title = this.settings.btnTitle;
					var $li = $('<li><input type="checkbox" /><label></label></li>');
					$li.find('label').text(title);
					$li.find('input').cookiefy(['GS-Menu',this.settings.id, 'render'].join('-'), this.settings.rendered, {path:'/'});
					$ul.append($li);
				});
			}
		}
	});
	
	$.fn.menu = function(settings){
		return Menu(this.get(0), settings);
	};
	$.fn.menu.prototype = Menu.prototype;
	$.fn.menu.wing = function(settings){
		return Menu.Wing.call(null, settings);
	};
	$.fn.menu.close = Menu.Wing.Close;
	$.fn.menu.config = Menu.Wing.Config;
	$.fn.menu.wing.prototype = Menu.Wing.prototype;
})($jq);
