// ==UserScript==
// @name            Moon Script Loader
// @description     Script de carregamento de scripts para moon
// @include         http://www.pontofrio.com.br/Site/ListaGerenciadaLandingPage.aspx?*
// @author      Fernando DarthJee Favini
// @version         0.0.1
// ==/UserScript==

(function(){
  var url = 'http://scripts.favinis.net/serverSided/moon/easy-loader.moon.js';
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', url);
    document.querySelector('head').appendChild(scrpt);
})();
