(function(){
	
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', 'http://dl.dropbox.com/u/5993666/gms/easyLoader/easyLoader.js');
    document.querySelector('head').appendChild(scrpt);
    
	var watcher = setInterval(function(){
		if (typeof easyLoader == "function")
		{
			var loader = easyLoader();
			
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/jq.js'
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/jquery.gs.menu.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/jquery.cookfy.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/jquery.gs.menu.facebook.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.cookiefy);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/jquery.gs.menu.colapser.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu);
				}
			});
			loader.add({
				url:'http://dl.dropbox.com/u/5993666/gms/facebook/facebook.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.menu.facebook && $jq.fn.menu.colapser);
				}
			});
			loader.run();
			
			
			
			clearInterval(watcher);
		}
	}, 500);
})()
