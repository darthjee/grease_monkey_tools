(function(){
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', 'http://scripts.favinis.net/serverSided/easyLoader/easyLoader.js');
    document.querySelector('head').appendChild(scrpt);

  var watcher = setInterval(function(){
    if (typeof easyLoader == "function")
    {
      var loader = easyLoader({cache:false});

      loader.add({
        url:'http://scripts.favinis.net/serverSided/easyLoader/moon/jq.js'
      });

      loader.add({
        url:'http://scripts.favinis.net/serverSided/easyLoader/moon/jquery.gs.menu.js',
        requisite:function(){
          return (window.$jq);
        }
      });

      loader.add({
        url:'http://scripts.favinis.net/serverSided/easyLoader/moon/jquery.gs.menu.moon.js',
        requisite:function(){
          return (window.$jq);
        }
      });

      loader.run();

      clearInterval(watcher);
    }
  }, 500);
})();
