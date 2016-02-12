// ==UserScript==
// @name            Moon Script Loader
// @description     Script de carregamento de scripts para moon
// @include         http://www.pontofrio.com.br/Site/ListaGerenciadaLandingPage.aspx?*
// @include         http://www.precolandia.com.br/lista+de+casamento*
// @include         http://www.precolandia.com.br/giftlistview.aspx?*
// @include         http://listadecasamento.fastshop.com.br/ListaCasamento/ListaCasamentoPresentesComprados.aspx
// @include         http://listadecasamento.fastshop.com.br/ListaCasamento/ListaCasamentoAguardandoComprador.aspx
// @author      Fernando DarthJee Favini
// @version         0.0.6
// ==/UserScript==

(function(){
    var url = 'http://scripts.favinis.net/serverSided/moon/easy-loader.moon.js',
        scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', url);
    document.querySelector('head').appendChild(scrpt);
})();
