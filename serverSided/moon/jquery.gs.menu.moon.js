(function($,Menu){
  Menu.moon = {};

  var precolandia = function(){
    var html = '';
    var set = {
      html : html,
      btnTitle:'precolandia',
      extraClass:'GMS-preco',
      render:function(){
        return window.location.href.match(/.*/);
      },
      bind:function(){
        var controler = this;
      }
    };
    return Menu.wing(set);
  };
  Menu.moon.precolandia = precolandia;
})($jq,$jq.fn.menu);
