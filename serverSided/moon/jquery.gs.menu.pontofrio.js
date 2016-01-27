(function($,Menu){
  Menu.moon = Menu.moon || {};

  var pontofrio = function(){
    var html = '<label for="store_id">Store</label> <input type="text" name="store_id" class="store_id" /> <br />' +
    '<label for="marriage_id">Marriage</label> <input type="text" name="marriage_id" class="marriage_id" /> <br />' +
    '<label for="admin_key">Key</label> <input type="password" name="admin_key" class="admin_key" /> <br />' +
    '<label for="json_record">Gifts: <span class="json_record_count"></span></label> <br />' +
    '<textarea class="json_record"></textarea> <br />' +
    '<button>import</button>';
    var set = {
      html : html,
      btnTitle:'pontofrio',
      extraClass:'GMS-ponto',
      render:function(){
        return window.location.href.match(/www.\pontofrio\.com\.br/);
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

    this.store_id.cookiefy('GMS-ptf-store-id');
    this.marriage_id.cookiefy('GMS-ptf-marriage-id');
    this.admin_key.cookiefy('GMS-ptf-admin-key');
    this.textarea.cookiefy('GMS-ptf-textarea');
  };

  fn.getGifts = function () {
    var $blocks = $('.comoAdicionar > tbody > tr'),
        that = this,
        list = [];

    list = $blocks.map(function(_, block) {
      return that.parseGift(_, block);
    }).get();

    return _.select(list, function(x) { return x; });
  };

  fn.parseGift = function(_, block) {
    var $block = $(block),
        priceMatch = $block.find('a:visible:eq(1)').text().trim().match(/\d+,\d+/),
        quantityMatch = $block.find('.quantidades').text().trim().match(/\d+/),
        boughtMatch = $block.find('.quantidades').text().trim().match(/\d+/g),
        href = $block.find('a:visible:eq(2)').attr('href'),
        price, image_url, quantity, bought, url, giftJson;

    price = priceMatch ? JSON.parse(priceMatch[0].replace(/,/,'.')) : null;
    image_url = $block.find('img').attr('src'),
    quantity = quantityMatch ? JSON.parse(quantityMatch[0]) : null,
    bought = boughtMatch ? JSON.parse(boughtMatch[1]) : null,
    url = href ? href.trim() : null;

    giftJson = {
      image_url: image_url.trim(),
      name: $block.find('a:visible:eq(0)').text().trim(),
      quantity: quantity,
      bought: bought
    };

    for(key in ['image_url', 'name', 'quantity', 'bought']) {
      val = giftJson[key];
      if(val == null) { delete giftJson['key']; }
    }

    return {
      url: url,
      price: price,
      gift: giftJson
    };
  };

  Menu.moon.pontofrio = pontofrio;
})($jq,$jq.fn.menu);
