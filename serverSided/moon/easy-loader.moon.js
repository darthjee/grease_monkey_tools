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
        url:'',
        requisite:function(){
          return (window.attribute);
        }
      });
      loader.run();

      clearInterval(watcher);
    }
  }, 500);
})();
