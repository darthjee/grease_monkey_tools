(function($,Menu){
  Menu.moon = {};

  var precolandia = function(){
    var html = '<input type="text" class="store_id" />' +
    '<input type="text" class="marriage_id" />' +
    '<button>import</button>';
    var set = {
      html : html,
      btnTitle:'precolandia',
      extraClass:'GMS-preco',
      render:function(){
        return window.location.href.match(/www.\precolandia\.com\.br/);
      },
      bind:function(){
        var controler = this,
            $div = controler.div,
            $button = $div.find('button'),
            $store_id = $div.find('.store_id'),
            $marriage_id = $div.find('.marriage_id');

        $button.click(function() {
          console.info({
            marriage_id: $marriage_id.val(),
            store_id: $store_id.val()
          });
        });

        $store_id.cookiefy('GMS-prcl-store-id');
        $marriage_id.cookiefy('GMS-prcl-marriage-id');
      }
    };
    return Menu.wing(set);
  };

  Menu.moon.precolandia = precolandia;
})($jq,$jq.fn.menu);
