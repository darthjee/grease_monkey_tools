// ==UserScript==
// @name            Copamais Script Loader
// @description     Script de carregamento de scripts para Copamais
// @include         http://www.ibm.com/
// @include         http://www.ibm.com/*
// @author      Fernando DarthJee Favini
// @version         1.0
// ==/UserScript==

(function(){
  
  var baseUrl = 'http://dl.dropbox.com/u/5993666/gms/vanessa/';
  var url = baseUrl+'easyLoader.vanessa.js';
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', url);
    document.querySelector('head').appendChild(scrpt);
})()
