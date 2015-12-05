(function($,Menu){
  Menu.moon = {};

  var precolandia = function(){
    var html = '<input type="text" class="store_id" /> <br />' +
    '<input type="text" class="marriage_id" /> <br />' +
    '<button>import</button>';
    var set = {
      html : html,
      btnTitle:'precolandia',
      extraClass:'GMS-preco',
      render:function(){
        return window.location.href.match(/www.\precolandia\.com\.br/);
      },
      bind:function(){
        var controler = new Controller(this);
        controler.start();
      }
    };
    return Menu.wing(set);
  };

  function Controller(controller) {
    this.div = controler.div;
  }

  var fn = Controller.prototype;

  fn.submit = function() {
    var $store_id = this.div.find('.store_id'),
        $marriage_id = this.div.find('.marriage_id');

     console.info({
        marriage_id: $marriage_id.val(),
        store_id: $store_id.val(),
        gifts: this.getGifts()
      });
  };

  fn.start = function() {
    var $button = this.div.find('button'),
        that = this;

    $button.click(function() {
      that.submit();
    });

    $store_id.cookiefy('GMS-prcl-store-id');
    $marriage_id.cookiefy('GMS-prcl-marriage-id');
  };

  fn.getGifts = function () {
    var $blocks = $('.border_listagem_right_cinza_claro');

    return $blocks.map(this.parseGift);
  };

  fn.parseGift = function() {
    var $block = $(this),
        $link = $block.find('a');

    return {
      image_url: $block.find('img').attr('src'),
      url: $link.attr('href'),
      name: $link.text
    };
  };

  Menu.moon.precolandia = precolandia;
})($jq,$jq.fn.menu);
