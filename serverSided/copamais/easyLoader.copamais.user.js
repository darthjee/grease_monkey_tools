// ==UserScript==
// @name            Copamais Script Loader
// @description     Script de carregamento de scripts para Copamais
// @include         http://copa/
// @include         http://copa/*
// @include         http://copamais:8080/
// @include         http://copamais:8080/*
// @include			http://200.222.74.82/todo/
// @include			http://200.222.74.82/todo/*
// @author			Fernando DarthJee Favini
// @version         1.2.0
// ==/UserScript==

(function(){
	var url = 'http://favini/copamais-script/easyLoader.copamais.js';
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', url);
    document.querySelector('head').appendChild(scrpt);
})()
