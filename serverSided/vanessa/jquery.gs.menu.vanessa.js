(function($,Menu) {
	var baseUrl = 'http://dl.dropbox.com/u/5993666/gms/vanessa/';

	Vanessa = {}

	batchParser = {
		id : 'parser',
		html : '<ul class="fases"><li><input type="radio" name="gs-vanesssa-parser-fase" id="gs-vanesssa-parser-fase-list" value="list" /><label for="gs-vanesssa-parser-fase-list">List Input</label></li><li><input type="radio" name="gs-vanesssa-parser-fase" id="gs-vanesssa-parser-fase-json" value="json" /><label for="gs-vanesssa-parser-fase-json">Json Input</label></li><li><input type="radio" name="gs-vanesssa-parser-fase" id="gs-vanesssa-parser-fase-csv" value="csv" /><label for="gs-vanesssa-parser-fase-csv">CSV Output</label></li></ul><div class="gs-vanessa-blocks"><fieldset id="gs-vanesssa-parser-list-div"><legend>Url List:</legend><textarea></textarea><br /><input type="button" class="read" value="Read List"/></fieldset><fieldset id="gs-vanesssa-parser-json-div"><legend>Json:</legend><ul class="servers"></ul><textarea></textarea><br /><input type="button" class="start" value="Start"/><input type="button" class="csv" value="Create CSV"/></fieldset><fieldset id="gs-vanesssa-parser-csv-div"><legend>CSV Output:</legend><textarea></textarea></fieldset></div>',
		btnTitle:'Batch',
		bind: function() {
			var controler = this;
			createParseControler(controler);
			var $div = controler.div;
			var $blocks = $div.find('.gs-vanessa-blocks').children().hide();
			var $buttons = $div.find('[name="gs-vanesssa-parser-fase"]');
			var $servers = $div.find('#gs-vanesssa-parser-json-div .servers');
			
			$buttons.bind('change', function(){
				var value = $(this).val();
				$blocks.hide();
				$blocks.filter('.gs-vanessa-blocks #gs-vanesssa-parser-'+value+'-div').show();
			});
			
			$blocks.find('.read').bind('click', function(){
				var urls = $div.find('#gs-vanesssa-parser-list-div textarea').val().replace(/\n\n+/g,'\n').split('\n');
				var json = controler.parseUrls(urls);
				$div.find('#gs-vanesssa-parser-json-div textarea').val(JSON.stringify(json));
				controler.parseJson(json);
				$buttons.filter(':eq(1)').click();
			});
		},
		posCall : function(){
			var controler = this;
			var $div = controler.div;
			var $buttons = $div.find('[name="gs-vanesssa-parser-fase"]');
			$buttons.filter(':eq(0)').click();
			$div.find('.gs-vanessa-blocks').children().filter(':eq(0)').show();
		}
	};
	
	function createParseControler(controler){
		var c = {
			parseUrls : function(urls){
				var json = {
					servers : {}
				}
				
				$(urls).each(function(){
					var url = this.trim();
					if (url){
						var server = url.match(/https?:\/\/[^/]*\//)[0];
						if (!json.servers[server]){
							json.servers[server] = {urls:[]};
						}
						json.servers[server].urls.push({url : url});
					}
				});
				return json;
			},
			parseJson : function(json){
				var controler = this;
				var $div = controler.div;
				var $servers = $div.find('#gs-vanesssa-parser-json-div .servers');
				$servers.html('');
				for (var server in json.servers) {
					var $li = $('<li></li>');
					$li.text(server);
					$li.addClass(server.checked ? 'checked' : 'unchecked');
					$servers.append($li);
				}
			}
		};
		$.extend(controler, c);
	}
	
	Vanessa.batchParser = Menu.wing(batchParser);
	
	Menu.vanessa = Vanessa;
})($jq,$jq.fn.menu);