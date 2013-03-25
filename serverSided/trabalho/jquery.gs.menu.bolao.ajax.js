/**
 * @file facebook/jquery.gs.menu.facebook.js
 * @brief aplicativos de menu para utilizacao com facebook
 */

(function($,Menu){
	
	/* definicao do objeto bolao contendo todos os wings */
	if (typeof Menu.bolao != "object")
		Menu.bolao = {};
	
	/* funcoes auxiliares */
	var funcs = {
		/**
		 * @brief checa se, em uma requisição, requisitamos um dado widget
		 */
		checkWidget : function(set, widgetNames, widgetParser){
			widgetParser = widgetParser ? widgetParser : function(){return true;}; 
			if (set && set.data && set.data.widgets)
			{
				var ret = false;
				var widgets = eval(set.data.widgets);
				$(widgetNames).each(function(nind){
					var needle = this;
					$(widgets).each(function(wind){
						var stack = this.name;
						if (!ret && stack.match(needle)){
							ret = ret || widgetParser.call(this, nind, wind);
						}
					});
				});
				return ret;
			}
			return false;
		}
	};
	
	
	/**
	 * @brief funcao que retorna uma wing de analise de requisicoes ajax
	 * jsonpWatcher coloca um midway no
	 */
	var jsonpWatcher = function(){
		var html = '<input type="button" class="start" value="start" /> <br />'+
		'<ul class="opts-algs"></ul>'+
		'<ul class="runs"></ul>'+
		'<div class="list"><ul class="script-list"></ul></div>'+
		'<div class="opts-config"></div>';
		var set = {
			html : html,
			btnTitle:'jsonp',
			extraClass:'GSM-jsonp-watchers',
			css:'.script-list li\n{\n	cursor:pointer\n}\n.script-list li:before\n{\n	content:"";\n}\n\n.script-list\n{\n	clear:both;\n	max-height:200px;\n	overflow-y:scroll;\n}\n\n.opts-algs li\n{\n	display:block;\n	float:left;\n	width:40px;\n}\n.opts-algs ul, .opts-algs ul li\n{\n	list-style:none outside none\n	margin:0px;\n}\nul.opts-algs li *\n{\n	float:none;\n	margin:0px 3px;\n}\n.opts-algs li label\n{\n	background: url("http://dl.dropbox.com/u/5993666/gms/trabalho/imgs/icons.png") no-repeat scroll transparent;\n	height: 13px;\n	margin: 0 3px 0 0;\n	text-indent: -9999px;\n	width: 13px;\n	position:absolute;\n}\n.opts-algs li label.watcher-opts-alg-comm\n{\n	background-position: -13px 0px;\n}\n.opts-algs li label.watcher-opts-alg-widg\n{\n	background-position: 0px 0px;\n}\n.opts-algs li label.watcher-opts-alg-inject\n{\n	background-position: -26px 0px;\n}',
			bind:function(){
				var controler = this;
				var $div = controler.div;
				var host = window.location.host;
				
				var $ul = $div.find('.list ul');
				var $start = $div.find('.start');
												
				controler.ajax = null;
				
				for (var method in jsonpWatcher.methods)
					controler[method] = jsonpWatcher.methods[method];
					
				controler.creatList();
				
				$start.bind('click', function(){
					if (controler.ajax)
						controler.ajax.enabled = false;
					$ul.html('');
					
					controler.ajax = controler.buildMidway();
					$.ajax = controler.ajax;
				});

			}
		};
		return Menu.wing(set);
	};
	jsonpWatcher.optsAlgs = {};
	jsonpWatcher.optsAlgs.comments = {
		disabled:false,
		config:function(controler){
			var $ul = controler.div.find('ul.script-list');
			return {
				analyzer:function(settings){
					if (settings && settings.dataType && settings.dataType.match('jsonp'))
						return true;
					return false;
				},
				parser:{
					success:function(result, status, jqXHR, settings, originalCallers){
						var src = settings.url;
						var call = {
							result:result,
							status:status,
							jqXHR:jqXHR,
							settings:settings,
							originalCallers:originalCallers
						};
						var $li = $('<li class="jsonp"></li>');
						$li.text(src.replace(/\?.*/,""));
						$ul.append($li);
						$li.bind('click', function(){
							console.info(call);
						});
					}
				}
			}
		},
		label:'comments',
		id:'watcher-opts-alg-comm',
		precall:function(){
			$('#comentarios').data('repercussao').Actions.init();
		}
	};
	jsonpWatcher.optsAlgs.widgets = {
		disabled:false,
		config:function(controler){
			var $ul = controler.div.find('ul.script-list');
			return {
				analyzer:function(settings){
					return funcs.checkWidget(settings, controler.widgetNames);
				},
				parser:{
					success:function(result, status, jqXHR, settings, originalCallers){
						var src = settings.url;
						var call = {
							result:$(result),
							resultHTML:result,
							status:status,
							jqXHR:jqXHR,
							settings:settings,
							originalCallers:originalCallers
						};
						var $li = $('<li class="widget"></li>');
						$li.text(src.replace(/\?.*/,""));
						$ul.append($li);
						$li.bind('click', function(){
							console.info(call);
						});
					}
				}
			}
		},
		label:'widgets',
		id:'watcher-opts-alg-widg',
		precall:function(){
			var controler = this;
			controler.widgetNames = controler.div.find('.widget-name').val().split(',');
		},
		configHtml:'<input type="text" class="widget-name"/>',
		bind:function(configDiv, controler){
			configDiv.find('.widget-name').cookiefy('GMS-jswatc-widget-name','',{expires:365,path:'/'});
		}
	};
	/**
	 * @brief algoritimo de injeção de codigo em requisição
	 */
	jsonpWatcher.optsAlgs.injecter = {
		disabled:false,
		config:function(controler){
			var $configDiv = controler.div.find('.watcher-opts-alg-inject');
			var textarea = $configDiv.find('.code-area').val();
			var pagename = $configDiv.find('.page-name').val();
			var action = $configDiv.find('[name="inject-pos"]:checked').val();
			var selector = $configDiv.find('.element-selector').val();
			var typeReq = 'dual';
			return {
				analyzer:function(settings){
					switch(typeReq){
						case 'dual':
						case 'page':
							var ret = funcs.checkWidget(settings, ['builtin.page'], function(nind, wind){
								return this.options.page == pagename;
							});
							if (ret || typeReq == 'page')
								break;
						case 'widget':
							ret = funcs.checkWidget(settings, [pagename]);
					}
					return ret;
				},
				parser:{
					success:function(result){
						var $div = $('<div></div>').html(result);
						var $content = $(textarea);
						$div.find(selector)[action]($content);
						arguments[0] = $div.html();
						return arguments;
					},
				}
			}
		},
		label:'injecter',
		id:'watcher-opts-alg-inject',
		precall:function(){
		},
		configHtml:'<label for="page-name">Page Name</label><br /><input class="page-name" name="page-name"><br />'+
		'<label for="element-selector">Selector</label><br /><input class="element-selector" name="element-selector"><br />'+
		'<label for="code-area">Code</label><br /><textarea class="code-area" name="code-area"></textarea><br />'+
		'<label id="type-injection"></label><br />'+
		'<label for="inject-pos">Bf</label><input type="radio" name="inject-pos" id="inject-pos" value="before" />'+
		'<label for="inject-pos">Af</label><input type="radio" name="inject-pos" id="inject-pos" value="after" />'+
		'<label for="inject-pos">Pp</label><input type="radio" name="inject-pos" id="inject-pos" value="prepend" />'+
		'<label for="inject-pos">Ap</label><input type="radio" name="inject-pos" id="inject-pos" value="append" />'+
		'<label for="inject-pos">Ht</label><input type="radio" name="inject-pos" id="inject-pos" value="html" />',
		bind:function(configDiv, controler){
			configDiv.find('.code-area').cookiefy('GMS-jswatc-code-area','',{expires:365,path:'/'});
			configDiv.find('.page-name').cookiefy('GMS-jswatc-page-name','bolao.bets',{expires:365,path:'/'});
			configDiv.find('.element-selector').cookiefy('GMS-jswatc-ele-sel','#proximas_apostas h3:first',{expires:365,path:'/'});
			configDiv.find('[name="inject-pos"]').cookiefy('GMS-jswatc-inj-pos','after',{expires:365,path:'/'}).click(function(){
				configDiv.find('#type-injection').text($(this).val());
			});
		}
	};
	/**
	 * @brief algoritimo de injeção de codigo em requisição
	 */
	jsonpWatcher.optsAlgs.forceError = {
		disabled:false,
		config:function(controler){
			var $configDiv = controler.div.find('.watcher-opts-alg-forceError');
			var widgetName = $configDiv.find('.widgetName').val();
			return {
				analyzer:function(settings){
					return funcs.checkWidget(settings, widgetName.split(","));
				},
				parser:{
					success:function(result){
						var $div = $('<div></div>').html(result);
						$(widgetName.split(",")).each(function(){
							var name = this.trim();
							var $widget = $div.find('[widgetname="'+name+'"]');
							$widget.removeClass('widgets');
							$widget.addClass('error');
							$widget.html('');
						});
						arguments[0] = $div.html();
						console.warn($div);
						return arguments;
					},
				}
			}
		},
		label:'forceError',
		id:'watcher-opts-alg-forceError',
		precall:function(){
		},
		configHtml:'<label for="error-widget-name">Widget Name</label><br /><input class="widgetName" name="error-widget-name">',
		bind:function(configDiv, controler){
			configDiv.find('.widgetName').cookiefy('GMS-jswatc-error-widget-name','',{expires:365,path:'/'});
		}
	};
	
	
	
	jsonpWatcher.methods = {};
	jsonpWatcher.methods.creatList = function(opts){
		var controler = this;
		var $div = controler.div;
		var $ul = $div.find('.opts-algs');
		var $config = $div.find('.opts-config');
		opts = opts ? opts : jsonpWatcher.optsAlgs;
		for (var key in opts)
		{
			(function(){
				var opt = opts[key];
				if (!opt.disabled)
				{
					/* criacao dos configs */
					var $optConfig = $("<div style='display:none'></div>").addClass(opt.id).html(opt.configHtml+'');
					$config.append($optConfig);
					if (opt.bind)
						opt.bind($optConfig, controler);
					
					/* criacao do li de input de opcao */
					var $li = $('<li><input type="checkbox" /><label></label></li>').bind("change", function(){
						$optConfig.toggleDisplay();
					});
					
					var $input = $li.find('input');
					var $label = $li.find('label');
					$input.attr('id',opt.id).data('watcher',opt);
					$label.attr('for', opt.id).addClass(opt.id).text(opt.label);
					var cookie = 'GMS-jswatc-'+opt.id;
					$input.cookiefy(cookie,1,{expires:365,path:'/'});
					$ul.append($li);
				}
			})();
		}
	};
	/**
	 * @brief constroi o midway para watcher
	 * 
	 * este midway é o coração dos watchers
	 */
	jsonpWatcher.methods.buildMidway = function(){
		var controler = this;
		var $div = controler.div;
		var configList = [];
		
		var config = {
			/* a analise roda por todas as opções de algoritimos */
			analyzer:function(settings){
				var validTotal = false;
				for (var i = 0; i < configList.length; i++)
				{
					if (configList[i].analyzer != null)
						valid = configList[i].analyzer.call(this, settings);
					else
						valid = true;
					configList[i].valid = valid;
					validTotal = validTotal || valid;
				}
				return validTotal;
			},
			parser:{
			}
		};
		/* tipos e funções possiveis */
		var fList = jsonpWatcher.midwayGenerator.fList;
		for (var i = 0; i < fList.length; i++)
		{
			var label = fList[i]
			config.parser[label] = (function(label){
				return function(){
					var args = arguments;
					var newargs; 
					for (var i = 0; i < configList.length; i++)
					{
						if (configList[i].valid)
						{
							newargs = null;
							if (configList[i].parser[label] != null)
								newargs = configList[i].parser[label].apply(this,args);
							if (newargs === false)
								return false;
							else if (typeof newargs !== "undefined" && newargs !== null)
								args = newargs;
						}
					}
					return args;
				}
			})(label)
		};
		
		var $ul = $div.find('.opts-algs input:checked').each(function(){
			var $input = $(this);
			var config = $input.data('watcher');
			var proto = $input.data('watcher').config(controler);
			configList.push(proto);
			if (config.precall != null)
				config.precall.call(controler);
		});
		return jsonpWatcher.midwayGenerator(config);
	};
	
	/**
	 * @breif gera uma funçao para servir de midway nas requisições ajax
	 *
	 * A função gerada irá interceptar todas as requisições ajax
	 */
	jsonpWatcher.midwayGenerator = function(settings)
	{
		settings = $.extend({
			parser : function(){},
			analyzer:function(){return true;}
		},settings);
		var midwayParserConf = settings.parser;
		var requestAnalyzer = settings.analyzer;
		if (!$.realAjax)
			$.realAjax = $.ajax;
		var ajax;
		
		var fList = jsonpWatcher.midwayGenerator.fList;
		var conf = {};
		for (var i = 0; i < fList.length; i++)
			conf[fList[i]]=function(){};
		midwayParserConf = $.extend(conf,midwayParserConf);
		
		ajax = function(url, settings)
		{
			if (typeof url == "object")
				settings = url;
			else
				settings.url = url;
			if (ajax.enabled && requestAnalyzer.call(this, settings))
			{
				var conf = {};
				for (var i = 0; i < fList.length; i++)
				{
					conf[fList[i]] = settings[fList[i]] != null ? settings[fList[i]] : (function(label){
						return function(){};
					})(fList[i]);
				}
				
				for (var i = 0; i < fList.length; i++)
				{
					settings[fList[i]] = (function(label){
						return function(){
							var args = Array.prototype.slice.call(arguments, 0);
							args.push(settings, conf);
							args = midwayParserConf[label].apply(this, args);
							if (typeof args === "undefined" || args === null)
								args = arguments;
							else if (args === false)
								return false;
							return conf[label].apply(this, args);
						};
					})(fList[i]);
				}
				
				ajax.realAjax.call($, settings);
			}
			else
			{
				ajax.realAjax.apply($, arguments);
			}
		};
		ajax.realAjax = $.ajax;
		ajax.enabled = true;
		return ajax;
	}
	/* funções possiveis de serem declaradas nas requisições ajax */
	jsonpWatcher.midwayGenerator.fList = ['success', 'error', 'complete','beforeSend'];
	Menu.bolao.jsonpWatcher = jsonpWatcher;
		
})(jQuery,jQuery.fn.menu);
