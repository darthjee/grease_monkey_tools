(function($,Menu){
  Menu.colapser = function(){
    var html = '<textarea></textarea><br /><input type="text" class="line"/><br />'+
    '<input type="button" class="split" value="split" /> '+
    '<input type="button" class="colapse-btn" value="colapse" /> '+
    '<input type="button" class="css-btn" value="css" />';
    var set = {
      html : html,
      btnTitle:'css',
      bind:function(){
        var div = this.div;
        var colapse = div.find('.colapse-btn');
        var split = div.find('.split');
        var cssBtn = div.find('.css-btn');
        var textarea = div.find('textarea');
        var input = div.find('.line');
         
        colapse.bind("click", function(){
          input.val(textarea.val().replace(/\n/g,"\\n"));
        });
        split.bind("click", function(){
          textarea.val(input.val().replace(/\\n/g,"\n"));
        });
        cssBtn.bind("click", function(){
          if (this.styleBlock)
            this.styleBlock.remove();
          var cssTxt = textarea.val();
          var $css = $('<style type="text/css">'+cssTxt+'</style>');
          $('body').append($css);
          this.styleBlock = $css;
        });
      }
    };
    return Menu.wing(set);
  };
})($jq,$jq.fn.menu)
