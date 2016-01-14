(function($,Menu){
  Menu.moon = Menu.moon || {};

  var fastshop = function(){
    var html = '<label for="store_id">Store</label> <input type="text" name="store_id" class="store_id" /> <br />' +
    '<label for="marriage_id">Marriage</label> <input type="text" name="marriage_id" class="marriage_id" /> <br />' +
    '<label for="admin_key">Key</label> <input type="password" name="admin_key" class="admin_key" /> <br />' +
    '<label for="json_record">Gifts: <span class="json_record_count"></span></label> <br />' +
    '<textarea class="json_record"></textarea> <br />' +
    '<button>import</button>';
    var set = {
      html : html,
      btnTitle:'fastshop',
      extraClass:'GMS-fast',
      render:function(){
        return window.location.href.match(/listadecasamento\.fastshop\.com\.br/);
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
    this.textarea = this.div.find('textarea');
    this.counter = this.div.find('.json_record_count');
  }

  var fn = Controller.prototype;

  fn.submit = function() {
    var previous = this.readJson(),
        new_record = {
          marriage_id: this.marriage_id.val(),
          store_id: this.store_id.val(),
          admin_key: this.admin_key.val(),
          gift_links: this.getGifts()
        };
    if (previous.gift_links) {
      new_record.gift_links = previous.gift_links.concat(new_record.gift_links);
    }
    this.counter.text(new_record.gift_links.length);
    this.textarea.val(JSON.stringify(new_record));
    this.textarea.trigger('change');
  };

  fn.readJson = function() {
    var str = this.textarea.val().trim();
    if (str == '') {
      str = '{}';
    };
    return JSON.parse(str);
  };

  fn.start = function() {
    var $button = this.div.find('button'),
        that = this;

    $button.click(function() {
      that.submit();
    });

    this.store_id.cookiefy('GMS-fstsp-store-id');
    this.marriage_id.cookiefy('GMS-fstsp-marriage-id');
    this.admin_key.cookiefy('GMS-fstsp-admin-key');
    this.textarea.cookiefy('GMS-fstsp-textarea');
  };

  fn.getGifts = function () {
    var $blocks = $('.box_prod_lista_casamento3 .prod_dicas_lista_info'),
        that = this;

    return $blocks.map(function(_, block) {
      return that.parseGift(_, block);
    }).get();
  };

  fn.parseGift = function(_, block) {
    var $block = $(block),
        $img = $block.find('a img:eq(0)'),
        image_url = $img.attr('src'),
        partial_url = $block.find('a:eq(0)').attr('href'),
        $price = $block.find('.actualPrice'),
        price = $price.text().match(/\d+,\d+/)[0].replace(',', '.'),
        url = 'http://listadecasamento.fastshop.com.br/ListaCasamento/'+partial_url,
        name = $block.find('h2 a').text().trim();

    if (name == '') {
      name = "Produto: " + partial_url.match(/idSku=([^&]*)&/)[1];
    }

    return {
      url: url,
      price: JSON.parse(price),
      gift: {
        image_url: image_url.trim(),
        name: name,
        quantity: 1
      }
    };
  };

  Menu.moon.fastshop = fastshop;
})($jq,$jq.fn.menu);