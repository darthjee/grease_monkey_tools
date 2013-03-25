/**
 * @file facebook/jquery.gs.menu.facebook.js
 * @brief aplicativos de menu para utilizacao com facebook
 */

(function($,Menu){
	Menu.copamais = {};
	
	
	/**
	 * @fn reloader
	 */
	var reloader = function(){
		var html = '<fieldset class="config">'+
		'<label for="gs-cm-reloader-big-interval">Intervalo Up</label><br />'+
		'<input id="gs-cm-reloader-big-interval" /><br />'+
		'<label for="gs-cm-reloader-small-interval">Intervalo Down</label><br />'+
		'<input id="gs-cm-reloader-small-interval" /><br />' +
		'<label for="gs-cm-reloader-last-time">Last Checked</label><br />'+
		'<input id="gs-cm-reloader-last-time" readonly="readonly" /><br />' +
		'<input type="button" class="watch" value="watch" /><input type="button" class="stop" value="stop" />'+
		'<input type="button" class="close" value="close" /><input type="hidden" id="gs-cm-reloader-closed" /><br />'+
		'<input type="checkbox" id="gs-cm-reloader-auto" /><label for="gs-cm-reloader-auto">Auto Load</label><br />'+
		'<input type="checkbox" id="gs-cm-reloader-reload" /><label for="gs-cm-reloader-reload">Reload</label><br />'+
		'</fieldset>'+
		'<div class="info"><span class="label">Status:</span>'+
		'<div id="gs-cm-reloader-status" class="status"><span class="ativo">Up</span><span class="inativo">Down</span></div>';
		var set = {
			id : 'cm-reloader',
			html : html,
			btnTitle:'Reload',
			extraClass:'GSM-reloader',
			render:function(){
				return true;
			},
			bind:function(){
				var controler = this;
				var id = controler.id;
				controler.watcher = null;
				var $div = controler.div;
				$.extend(controler, createReloaderControl());
				controler.setObjetcts()
				with (controler.objs){
					$div.find('.watch').bind('click', function(){
						controler.update();
						if (controler.watcher)
							clearInterval(controler.watcher);
						function checkStatus(){
							$last.val((new Date()).toLocaleTimeString());
							$jq.ajax({url:'/?'+'t='+Date.now(), success:function(){
								if (!controler.status && controler.refresh)
									controler.refresher();
								controler.status = true;
								controler.updateStatus();
							},
							error:function(){
								var oldStatus = controler.status;
								controler.status = false;
								controler.updateStatus();
								if (oldStatus)
									$div.find('.watch').trigger('click');
							}});
						}
						controler.watcher = setInterval(checkStatus,(controler.status ? controler.bigInterval : controler.smallInterval)*1000);
						checkStatus();
					});
					$div.find('.stop').bind('click', function(){
						if (controler.watcher)
							clearInterval(controler.watcher);
						$status.removeClass('ativo inativo');
					});
					$div.find('.close').bind('click', function(){
						$div.find('.config').hide();
						$closed.val(1);
						$closed.trigger('change');
					});
					
					controler.bindUpdate();
					controler.cookiefy();
					$div.filter(':checked').trigger('change');
					
					if ($closed.val() == "1"){
						$div.find('.close').click();
					}
				}
			},
			view : function(){
				var id = this.id;
				var $closed = this.div.find('#gs-'+id+'-closed');
				if (this.ready || $closed.val() != "1"){
					this.div.find('.config').show();
					$closed.val("0");
					$closed.trigger("change");
				} else{
					this.div.find('.config').hide();
				}
				this.ready = true;
			},
		};
		set.config = reloader.config;
		return Menu.wing(set);
	};
	
	function createReloaderControl(){
		var controler = {status:true};
		
		controler.update = function(){
			var controler = this;
			var realControler = controler.configFor ? controler.configFor : controler;
			with (controler.objs){
				realControler.bigInterval = Number($bigInterval.val().replace(/,/g,"."));
				realControler.smallInterval = Number($smallInterval.val().replace(/,/g,"."));
				realControler.auto = $auto.is(':checked');
				realControler.refresh = $refresh.is(':checked');
			}
			if (controler != realControler){
				realControler.updateHtml();
			}
		};
		controler.updateStatus = function(){
			with (this.objs){
				$status.changeClass(this.status ? 'ativo':'inativo',['ativo','inativo']);
			}
		}
		controler.updateHtml = function(){
			with (this.objs){
				$bigInterval.val(this.bigInterval);
				$smallInterval.val(this.smallInterval);
				if (this.auto != $auto.is(':checked')) $auto.click();
				//$closed.
				if (this.refresh != $refresh.is(':checked')) $refresh.click();
			}
		};
		controler.refresher = function(){
			window.location.href=window.location.href;
		};
		controler.cookiefy = function(){
			var controler = this;
			var id = controler.id;
			var options = {path:'/', expires:30};
			with (controler.objs){
				$bigInterval.cookiefy('gs-'+id+'-big-interval', 10, options);
				$smallInterval.cookiefy('gs-'+id+'-small-interval', 1, options);
				$auto.cookiefy('gs-'+id+'-auto', 0, options);
				$closed.cookiefy('gs-'+id+'-closed', false, options);
				$refresh.cookiefy('gs-'+id+'-reload', false, options);
			}
		};
		controler.setObjetcts = function(){
			var controler = this;
			var id = controler.id;
			var $div = controler.div;
			controler.objs = {
                $bigInterval : $div.find('#gs-'+id+'-big-interval'),   
                $smallInterval : $div.find('#gs-'+id+'-small-interval'),
                $status : $div.find('#gs-'+id+'-status'),
                $last : $div.find('#gs-'+id+'-last-time'),       
                $closed : $div.find('#gs-'+id+'-closed'),                                          
                $refresh : $div.find('#gs-'+id+'-reload'),
                $auto : $div.find('#gs-'+id+'-auto')
			}
		}
		controler.bindUpdate = function(){
			var controler = this;
			var id = controler.id;
			var $div = controler.div;

			with (controler.objs){
				$bigInterval.bind('change', function(){
					controler.update();
				});
				$smallInterval.bind('change', function(){
					controler.update();
				});
				
				$auto.bind('change', function(){
					controler.update();
					if (controler.auto)
						$div.find('.watch').click();
				});
				$refresh.bind('change', function(){
					controler.update();
				});
			}
		}
		return controler;
	}
	
	reloader.config = {
		html:'<fieldset class="config">'+
		'<label for="gs-cm-reloader-big-interval">Intervalo Up</label><br />'+
		'<input id="gs-cm-reloader-big-interval" /><br />'+
		'<label for="gs-cm-reloader-small-interval">Intervalo Down</label><br />'+
		'<input id="gs-cm-reloader-small-interval" /><br />' +
		'<input id="gs-cm-reloader-closed" /><br />'+
		'<input type="checkbox" id="gs-cm-reloader-auto" /><label for="gs-cm-reloader-auto">Auto Load</label><br />'+
		'<input type="checkbox" id="gs-cm-reloader-reload" /><label for="gs-cm-reloader-reload">Reload</label><br />'+
		'</fieldset>',
		bind:function(){
			var controler = this;
			var id = controler.id;
			var $div = controler.div;
			with (controler.objs){
				controler = $.extend(controler, createReloaderControl());
				controler.setObjetcts();
				controler.cookiefy();
				controler.bindUpdate();
			}
		}
	};
	
	Menu.copamais.reloader = reloader;
})($jq,$jq.fn.menu);
