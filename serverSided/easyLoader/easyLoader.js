function easyLoader (config){
	if (this.constructor != easyLoader)
	{
		return new easyLoader(config);
	}
	else
	{
		config = config ? config : {};
		var list = [];
		var self = this;
		var watcher = null;
		var ready = false;
		var interval = config.interval ? config.interval : 100;
		var cache = config.cache === undefined ? true : config.cache;
		
		this.add = function(config){
			config.requisite = config.requisite ? config.requisite : function(){return true;};
			list.push(config);
		};
		
		this.run = function(){
			if (watcher)
			{
				clearInterval(watcher);
				watcher = null;
				ready = false;
			}
			watcher = setInterval(function(){
				if (ready)
				{
					clearInterval(watcher);
					watcher = null;
				}
				else
				{
					var check = true;
					for (var i = 0; i < list.length; i++)
					{
						if (!list[i].loaded)
						{
							check = false;
							if(list[i].requisite())
								self.append(list[i]);
						}
					}
					if (check)
						ready = true;
				}
			},interval);
		};
		
		this.append = function(config){
			function addUrlPar(url, map){
				var pars = url.match(/\?/) ? url.replace(/[^?]*\?/,"").split('&') : [];
				for (key in map)
					pars.push(key+'='+map[key]);
				url = url.replace(/([^?]*)\?.*/,"$1");
				url = pars.length ? url+'?'+pars.join('&') : url;
				return url;
			}
			
			var src = cache ? config.url : addUrlPar(config.url, {t:Date.now()});
			var scrpt = document.createElement('script');
			scrpt.setAttribute('type','text/javascript');
			scrpt.setAttribute('src', src);
			document.querySelector('head').appendChild(scrpt);
			config.loaded = true;
		};
	}
}