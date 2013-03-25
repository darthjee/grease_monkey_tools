(function(){
	var baseUrl = 'http://dl.dropbox.com/u/5993666/gms/vanessa/';
	
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', baseUrl+'easyLoader.js');
    document.querySelector('head').appendChild(scrpt);
    
	var watcher = setInterval(function(){
		if (typeof easyLoader == "function")
		{
			var loader = easyLoader({cache:false});
			
			loader.add({
				url:baseUrl+'jq.js'
			});
			loader.add({
				url:baseUrl+'jquery.gs.menu.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:baseUrl+'jquery.cookfy.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:baseUrl+'jquery.gs.menu.vanessa.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.cookiefy);
				}
			});
			loader.add({
				url:baseUrl+'vanessa.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.menu.vanessa);
				}
			});
			loader.run();
			
			
			
			clearInterval(watcher);
		}
	}, 500);
})()
