// ==UserScript==
// @name            Facebook Script Loader
// @description     Script de carregamento de scripts para facebook
// @include         http://www.facebook.com
// @include         http://www.facebook.com/*
// @author      Fernando DarthJee Favini
// @version         1.1

(function(){
  
  var url = 'http://dl.dropbox.com/u/5993666/gms/facebook/easyLoader.facebook.js';
    var scrpt = document.createElement('script');
    scrpt.setAttribute('type','text/javascript');
    scrpt.setAttribute('src', url);
    document.querySelector('head').appendChild(scrpt);
    
})()
