(function($,Menu){
  Menu.moon = {};

  var precolandia = function(){
    var html = '<label for="store_id">Store</label> <input type="text" name="store_id" class="store_id" /> <br />' +
    '<label for="marriage_id">Marriage</label> <input type="text" name="marriage_id" class="marriage_id" /> <br />' +
    '<label for="admin_keyd">Key</label> <input type="password" name="admin_key" class="admin_key" /> <br />' +
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
    this.div = controller.div;
    this.admin_key = this.div.find('.admin_key');
    this.store_id = this.div.find('.store_id');
    this.marriage_id = this.div.find('.marriage_id');
    this.list_id = document.location.search.match(/idgiftlist=([^&]*)/)[1];
  }

  var fn = Controller.prototype;

  fn.submit = function() {
     console.info({
        marriage_id: this.marriage_id.val(),
        store_id: this.store_id.val(),
        admin_key: this.admin_key.val(),
        gift_links: this.getGifts()
      });
  };

  fn.start = function() {
    var $button = this.div.find('button'),
        that = this;

    $button.click(function() {
      that.submit();
    });

    this.store_id.cookiefy('GMS-prcl-store-id');
    this.marriage_id.cookiefy('GMS-prcl-marriage-id');
  };

  fn.getGifts = function () {
    var $blocks = $('.border_listagem_right_cinza_claro'),
        that = this;

    return $blocks.map(function(_, block) {
      return that.parseGift(_, block);
    });
  };

  fn.parseGift = function(_, block) {
    var $block = $(block),
        partial_image_path = $block.find('img').attr('src'),
        image_url = 'http://www.precolandia.com.br/' + partial_image_path;
        product_id = partial_image_path.match(/\/(\d*)e.JPG/)[1],
        url = 'https://www.precolandia.com.br/product.aspx?idproduct='+product_id+'&idGiftList='+this.list_id;

    return {
      url: url,
      gift: {
        image_url: image_url,
        name: $block.find('a').text()
      }
    };
  };

  Menu.moon.precolandia = precolandia;
})($jq,$jq.fn.menu);
