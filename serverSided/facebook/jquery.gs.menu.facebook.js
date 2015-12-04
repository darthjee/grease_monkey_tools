/**
 * @file facebook/jquery.gs.menu.facebook.js
 * @brief aplicativos de menu para utilizacao com facebook
 */

(function($,Menu){
  Menu.facebook = {};


  /**
   * @fn requester
   * @brief aplicativo de menu capaz de aceitar
   * todos as requisicoes de jogos
   *
   *
   * A utilizacao deve ser feita com o facebookgames.com
   */
  var requester = function(){
    var html = '<input type="button" class="accept" value="accept" /><br />'+
    '<h3 class="selected"></h3>'+
    '<div class="item-list"><ul></ul></div>';
    var set = {
      html : html,
      btnTitle:'req',
      extraClass:'GSM-requester',
      render:function(){
        return window.location.href.match(/http:\/\/(www\.)?facebook\.com\/games\/?/);
      },
      bind:function(){
        var controler = this;
        controler.findApp = requester.findApp;

        var list = controler.findApp();
        var $div = this.div;
        var $ul = $div.find('.item-list ul');
        var $selected = $div.find('h3');
        $(list).each(function(){
          var $li = $('<li class="link"></li>');
          $li.text(this.name);
          $ul.append($li);
          var $link = this.dom;
          $li.bind("click", function(){
            controler.selected = $link;
            $selected.text($li.text());
          });
        });

        $div.find('.accept').bind("click", function(){
          if (controler.selected)
          {
            var $lis = controler.selected.find('ul.requests li.requestStatus');
            $lis.each(function(){
              var $li = $(this);
              var $input = $li.find('.uiButtonConfirm input');
              var name = $input.attr('name');
              var url = name.replace(/^actions\[(.*)\]$/g,"$1");
              var $iframe = $('<iframe style="position:absolute; bottom:1px; width:1px;height:1px;opacity:0;" class="hidden-opener"></iframe>');
              $iframe.attr('src', url);
              setTimeout(function(){$iframe.remove();}, 3000);
              $('body').append($iframe);
              $li.remove();
            });
          }
        });
      }
    };
    return Menu.wing(set);
  };
  requester.findApp = function()
  {
    var list = $('#pagelet_requests ul.uiList:first').find('li.pvm,li.ptm,li.pbm');
    var objs = [];
    list.each(function(){
      var $this = $(this);
      var obj = {
        name:$this.find('div.pts.UIImageBlock_Content .fsm a strong').text(),
        dom:$this
      };
      objs.push(obj);
    });
    return objs;
  };
  Menu.facebook.requester = requester;



  /**
   * @fn crawler
   * @brief aplicativo de menu capaz de clicar
   * todos as requisicoes de jogos no mural
   */
  var crawler = function(){
    var html = '<input type="button" class="find" value="Posts" />'+
    '<input type="button" class="click" value="Click" />'+
    '<input type="button" class="remove" value="Del" /><br />'+
    '<h3></h3>'+
    '<div class="item-list"><ul></ul></div>'+
    '<div class="filter-list"><ul></ul></div><hr />'+
    '<div class="opts-list"><ul>'+
    '<li><input type="checkbox" id="gs-fb-remove-posts-found" /><label for="gs-fb-remove-posts-found">Remover Encontrados</label></li>'+
    '<li><input type="checkbox" id="gs-fb-remove-posts-normal" /><label for="gs-fb-remove-posts-normal">Remover Normais</label></li>'+
    '<li><input type="checkbox" id="gs-fb-crawl-more" /><label for="gs-fb-crawl-more">Mais Paginas</label></li>'+
    '</ul></div>';
    var set = {
      html : html,
      btnTitle:'crawl',
      extraClass:'GSM-crawler',
      bind:function(){
        var controler = this;
        controler.apps = [];
        controler.addApp = crawler.addApp;
        controler.addAllApp = crawler.addAllApp;
        controler.findPosts = crawler.findPosts;
        controler.nextPage = crawler.nextPage;
        controler.posts = [];
        controler.removeFound = false;
        controler.removeNotFound = false;
        controler.crawlMore = false;


        var $div = controler.div;

        $div.find('.find').bind("click", function(){
          var apps = $(controler.apps).filter(function(){return this.selected;});
          controler.posts = controler.findPosts(apps);
          if (controler.posts.length <= 0 && controler.crawlMore)
          {
            controler.nextPage();
            setTimeout(function(){$(this).click();}, 1500);
          }
        });
        $div.find('.click').bind("click", function(){
          window.list = [];
          $(controler.posts).each(function(){
            this.clickAccept(controler.removeFound);
          });
          if(controler.crawlMore)
            controler.nextPage();
        });
        $div.find('.remove').bind("click", function(){
          $(controler.posts).each(function(){
            this.remove();
          });
          if (controler.crawlMore)
          {
            controler.nextPage();
            setTimeout(function(){$div.find('.find').click();}, 1500);
          }
        });
        $div.find('.opts-list #gs-fb-remove-posts-found').bind("change", function(){
          controler.removeFound = !controler.removeFound;
        });
        $div.find('.opts-list #gs-fb-remove-posts-normal').bind("change", function(){
          controler.removeNotFound = !controler.removeNotFound;
        });
        $div.find('.opts-list #gs-fb-crawl-more').bind("change", function(){
          controler.crawlMore = !controler.crawlMore;
        });
        $div.find('.opts-list input').each(function(){
          var $this = $(this);
          $this.attr('checked', 'checked');
        });

        controler.appList = $div.find('.filter-list ul');
        controler.addAllApp();


        $div.find('.opts-list input').each(function(){
          var $box = $(this);
          var id = $box.attr('id');
          $box.cookiefy('GMS-fbk-craw-opt-'+id,1);
          if ($box.attr('checked'))
            $box.trigger("change");
        });
      }
    };
    return Menu.wing(set);
  };
  crawler.nextPage = function(){
    $jq('.uiMorePagerPrimary').trigger('click');
  };
  crawler.findPosts = function(apps){
    var arr = [];
    var $list = $('#contentArea').find('#pagelet_wall,#pagelet_home_stream').find('#profile_minifeed,#home_stream').find('li.pvm');
    var controler = this;
    $list.each(function(){
      var $li = $(this);
      var found = false;
      for (var i = 0; i < apps.length; i++)
      {
        var app = apps[i];
        if (app.selected && app.analyse.apply($li))
        {
          arr.push($li);
          $li.clickAccept = app.clickAccept;
          $li.css('background',app.background);
          found = true;
          break;
        }
      }
      if (!found && controler.removeNotFound)
        $li.remove();
    });
    return arr;
  };
  crawler.addApp = function(id, app){
    app = $.extend({
      background:'#88f',
      clickAccept:crawler.genericClickAccept,
      selected:true
    },app);
    this.apps.push(app);
    var $li = $('<li><input type="checkbox" /><label></label></li>');
    $li.find('input').attr('id', id);
    $li.find('label').attr('for', id);
    $li.find('label').text(app.title);
    var $input = $li.find('input');
    $input.cookiefy('GMS-fbk-craw-filter-'+id,app.selected ? 1 : 0);
    $input.bind("change", function(){
      app.selected = !app.selected;
    });
    if ($input.attr('checked') != app.selected)
      $input.trigger("change");
    this.appList.append($li);
  };
  crawler.addAllApp = function(){
    var list = crawler.apps;
    for (var id in list)
    {
      var app = list[id];
      if (app.id)
        id = app.id;
      this.addApp(id,app);
    }
  };
  crawler.apps = {};
  crawler.genericClickAccept = function(remove){
    var $this = this;
    $this.find('form').attr('target','_blank');
    var accept = $this.find('form .UIImageBlock_Content .UIActionLinks a');
    accept.attr('target','_blank');
    var href=accept.attr('href');
    var $iframe = $('<iframe style="position:absolute; bottom:1px; width:1px;height:1px;opacity:0;" class="hidden-opener"></iframe>');
    $iframe.attr('src', href);
    setTimeout(function(){$iframe.remove();}, 3000);
    $('body').append($iframe);
    if (remove)
      $this.remove();
  };
  crawler.createGericAnalyser = function(appIdMatch){
    return function(){
      var data = this.attr('data-ft');
      var appId = null;
      if (data && data.match(/.*"app_id":"([^"]*)".*/))
        appId = data.replace(/.*"app_id":"([^"]*)".*/,"$1");
      return (appId == appIdMatch);
    };
  };
  crawler.apps.farmville = {
    title:'Farmville',
    id:'farmville-gms',
    ignore:false,
    selected:true,
    background:'#8ea',
    analyse:crawler.createGericAnalyser(102452128776)
  };
  crawler.apps.simsSocial = {
    title:'Sims Social',
    id:'sims-social-gms',
    ignore:false,
    selected:true,
    background:'#8ae',
    analyse:crawler.createGericAnalyser(144959615576466)
  };
  crawler.apps.cityVille = {
    title:'City Ville',
    id:'city-ville-gms',
    ignore:false,
    selected:true,
    background:'#ea8',
    analyse:crawler.createGericAnalyser(291549705119)
  };
  crawler.apps.ded = {
    title:'Dungeons &Dragon',
    id:'ded-gms',
    ignore:false,
    selected:true,
    background:'#fe7',
    analyse:crawler.createGericAnalyser(156366727771379)
  };
  crawler.apps.aquarium = {
    title:'Happy Aquarium',
    id:'aquarium-gms',
    ignore:false,
    selected:true,
    background:'#f7e',
    analyse:crawler.createGericAnalyser(134920244184)
  };
  Menu.facebook.crawler = crawler;









  /**
   * @fn crawler
   * @brief aplicativo de menu capaz de clicar
   * todos as requisicoes de jogos no mural
   */
  var poker = function(){
    var html = '<input type="button" class="poke-em" value="poke-em" />';
    var set = {
      html : html,
      btnTitle:'pokem',
      extraClass:'GSM-crawler',
      css:'',
      bind:function(){
        var controler = this;
        var $div = controler.div;
        controler.poker = new poker.controller();


        $div.find('.poke-em').bind("click", function(){
          var list = $('.home_right_column .mvm.fbCurrent .fbCurrentStory').filter(function(){
            var $this = $(this);
            return ($this.find('i.sx_440b62').length > 0);
          });
          list.each(function(){
            var $this = $(this);
            controler.poker.addPoke($this.find('a').children());
          });
          controler.poker.click();
        });
      }
    };
    return Menu.wing(set);
  };
  poker.controller = function(){
    if (this.constructor != poker.controller)
      return new poker.controller();
    else
    {
      this.pokes = [];
      this.status = 1;
    }
  };
  poker.controller.prototype.addPoke = function($dom)
  {
    var $li = $dom.findParent('.fbCurrentStory');
    var poke = {
      dom:$dom,
      li:$li,
      id:$li.attr('id')
    };
    this.pokes.push(poke);
  };
  poker.controller.prototype.click = function()
  {
    var controler = this;
    if (controler.status)
    {
      controler.status = 0;
      console.log(controler.pokes);
    }
  };

  Menu.facebook.poker = poker;

})($jq,$jq.fn.menu);
