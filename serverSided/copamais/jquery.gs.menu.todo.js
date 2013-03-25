/**
 * @file facebook/jquery.gs.menu.facebook.js
 * @brief aplicativos de menu para utilizacao com facebook
 */

(function($,Menu){
	Menu.todo = {};
	
	
	var tclock = function(){
		var html = 
		'<input type="checkbox" class="gs-td-clock-watch" value="watch" />'+
		'<label for="gs-td-clock-watch">Watch</label>';
		var set = {
			id : 'td-tclock',
			html : html,
			btnTitle:'TClock',
			extraClass:'GSM-tclock',
			render:function(){
				return window.location.url.match("http://200.222.74.82/todo/");
			},
			bind:function(){
				var controller = this;
				var $div = controller.div;
				
				var $watch = $div.find('.watch');
				$watch.bind('change', function(){
					
				});
			},
			view : function(){
			},
			config : tclock.config
		};
		
		return Menu.wing(set);
		
	};
	
	Menu.todo.tclock = tclock;
})($jq,$jq.fn.menu);
