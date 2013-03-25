/**
 * @file facebook/jquery.gs.menu.facebook.js
 * @brief aplicativos de menu para utilizacao com facebook
 */

(function($,Menu){
	if (typeof Menu.bolao != "object")
		Menu.bolao = {};
	
	
	/**
	 * @fn requester 
	 * @brief aplicativo de menu capaz de aceitar
	 * todos as requisicoes de jogos
	 * 
	 * 
	 * A utilizacao deve ser feita com o facebookgames.com
	 */
	var idBringer = function(){
		var html = '<input type="button" class="start" value="start" /><input type="button" class="stop" value="stop" /><br />'+
		'<input type="text" class="props" value="props" /><br />'+
		'<textarea class="value"></textarea>';
		var set = {
			html : html,
			btnTitle:'idts',
			extraClass:'GSM-idBringer',
			css:'.GMS-id-bringer-selected{box-shadow: 0px 0px 10px 0px rgba(255, 0, 0, 1); }',
			bind:function(){
				var controler = this;
				var $div = controler.div;
				var $input = $div.find('.props');
				var $field = $div.find('.value');
				controler.props = idBringer.props;
				$input.cookiefy('GMS-bolao-props',controler.props);
				
				
				var bindFunc = function(evt){
					evt.stopPropagation();
					var $this = $(this);
					var values = [];
					$(controler.propsArr).each(function(){
						var prop = this.valueOf();
						if ($this.attr(prop))
							values.push(prop+' : '+$this.attr(prop));
					});
					$field.val(values.join('\n'));
					$this.addClass('GMS-id-bringer-selected');
				};
				
				
				$div.find('.start').bind("click", function(){
					controler.props = $input.val();
					controler.propsSel = controler.props.replace(/,/g,"],[");
					controler.propsArr = controler.props.split(',');
					$input.attr('disabled', 'disabled');
					
					var $objs = $('body ['+controler.propsSel+']');
					$objs.unbind("mouseover.idBringer", bindFunc);
					$objs.bind("mouseover.idBringer", bindFunc);
					
					$objs.unbind("click.idBringer");
					$objs.bind("click.idBringer", function()
					{
						$div.find('.stop').click();
					});
					
					$objs.unbind("mouseout.idBringer");
					$objs.bind("mouseout.idBringer", function(){
						$(this).removeClass('GMS-id-bringer-selected');
					});
				});
				$div.find('.stop').bind("click", function(){
					$input.attr('disabled', false);
					var $objs = $('body ['+controler.propsSel+']');
					$objs.unbind("mouseover.idBringer", bindFunc);
					$objs.unbind("click.idBringer");
					$objs.unbind("mouseout.idBringer");
					$('.GMS-id-bringer-selected').removeClass('GMS-id-bringer-selected');
				});
			}
		};
		return Menu.wing(set);
	};
	idBringer.props = "idtTeam,idtevent";
	Menu.bolao.idBringer = idBringer;
	
	
	
	
	
	
	var watcher = function(){
		var html = '<input type="button" class="evt1" value="evt1" id="evt1-btn" /> <label for="evt1-btn"></label>';
		var set = {
			html : html,
			btnTitle:'watchers',
			extraClass:'GSM-watchers',
			css:'',
			bind:function(){
				var controler = this;
				var $div = controler.div;
				
				$div.find('.evt1').bind('click', function(){
					var div = $('.score-details-anchor').show().css({position:'fixed',top:0,left:0});
					var parent = $('.float-anchor:first');
					var body = $('body');
					var label = $div.find('[for=evt1-btn]');
					if (div.parent().is('body'))
					{
						parent.append(div);
						label.text('anchor');
					}
					else
					{
						body.append(div);
						label.text('body');
					}
				});
			}
		};
		return Menu.wing(set);
	};
	Menu.bolao.watcher = watcher;

		
})(jQuery,jQuery.fn.menu);
