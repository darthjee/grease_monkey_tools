(function(){
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', 'http://favini/easyLoader/easyLoader.js');
    document.querySelector('head').appendChild(scrpt);
    
	var watcher = setInterval(function(){
		if (typeof easyLoader == "function")
		{
			var loader = easyLoader({cache:false});
			
			loader.add({
				url:'http://favini/copamais-script/jq.js'
			});
			loader.add({
				url:'http://favini/copamais-script/jquery.gs.menu.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:'http://favini/copamais-script/jquery.cookfy.js',
				requisite:function(){
					return (window.$jq);
				}
			});
			loader.add({
				url:'http://favini/copamais-script/jquery.gs.menu.copamais.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.cookiefy);
				}
			});/*
			loader.add({
				url:'http://favini/copamais-script/jquery.gs.menu.todo.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.cookiefy);
				}
			});*/
			loader.add({
				url:'http://favini/copamais-script/jquery.gs.menu.colapser.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu);
				}
			});
			loader.add({
				url:'http://favini/copamais-script/copamais.js',
				requisite:function(){
					return (window.$jq && $jq.fn.menu && $jq.fn.menu.colapser && $jq.fn.menu.copamais);
				}
			});
			loader.run();
			
			
			
			clearInterval(watcher);
		}
	}, 500);
})();
