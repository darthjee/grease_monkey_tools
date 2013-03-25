(function(){
	
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', 'http://dl.dropbox.com/u/5993666/gms/easyLoader/easyLoader.js');
    document.querySelector('head').appendChild(scrpt);
    
	var watcher = setInterval(function(){
		var stages = {
			menu:false,
			cookiefy:false,
			functions:false,
			finall:false
		}
		if (typeof easyLoader == "function" && typeof jQuery != "undefined")
		{
			var loader = easyLoader();
			
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/jquery.gs.menu.js'
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/jquery.cookfy.js'
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/jquery.functions.js'
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/trabalho/jquery.gs.menu.bolao.js',
				requisite:function(){
					if (jQuery.fn.menu)
					{
						stages.menu=true;
						if (jQuery.fn.cookiefy)
							stages.cookiefy = true;
					}
					return (stages.cookiefy);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/trabalho/jquery.gs.menu.bolao.ajax.js',
				requisite:function(){
					return (stages.cookiefy);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/jquery.gs.menu.colapser.js',
				requisite:function(){
					return (stages.menu);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/trabalho/bolao.js',
				requisite:function(){
					if (jQuery.fn.toggleDisplay)
						stages.functions = true;
					if (stages.functions && stages.menu)
					{
						if (jQuery.fn.menu.bolao && jQuery.fn.menu.bolao.jsonpWatcher && jQuery.fn.menu.bolao.idBringer && jQuery.fn.menu.colapser)
							stages.finall = true;
					}
					return (stages.finall);
				}
			});
			loader.run();
			
			clearInterval(watcher);
		}
	}, 500);
})()
