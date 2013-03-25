// ==UserScript==
// @name            Server Sided GreaseMonkey Script
// @description     Script de carregamento de scripts para facebook
// @include         *
// @author			Fernando DarthJee Favini
// @version         1.1
/**
* @file greaseTool.server.user.js
* @brief script de usuario para greasemonkey para carregar scripts
*/


var log = (typeof unsafeWindow != "undefined") ? unsafeWindow.console.log : console.log;

function startup()
{
  var config = ({
    id : 'grst-window',
    div : null,
    css : '#grst-window\n{\n	position:fixed;\n	top:40px;\n	right:10px;\n	z-index:5;\n}\n\n#grst-window .grst-menu span\n{\n	color:#000;\n	font-weight:bold;\n	padding:1px 3px;\n	cursor:pointer;\n}\n\n#grst-window .grst-menu span:hover\n{\n	color:#fff;\n	background:#000;\n}\n\n#grst-window .grst-menu span#grst-close-btn\n{\n	float:right;\n	color:#f00;\n	background:#000;\n}\n#grst-window .grst-menu span#grst-close-btn:hover\n{\n	color:#000;\n	background:#f00;\n}\n\n#grst-window.closed .grst-menu span\n{\n	display:none;\n}\n#grst-window .grst-menu span#grst-open-btn\n{\n	display:none;\n}\n#grst-window.closed .grst-menu span#grst-open-btn\n{\n	display:inline;\n	color:#fff;\n	background:#a40;\n}\n\n#grst-window.closed .grst-content\n{\n	display:none;\n}\n',
    cssId : 'grst-css',
    cssBlock : null,
    innerHTML : '<div class="grst-menu"><span id="grst-start-btn">S</span> <span id="grst-close-btn">X</span> <span id="grst-open-btn">Open</span></div>'+
    '<div class="grst-content"><textarea id="grst-urls"></textarea><br />'+
    '<input type="checkbox" id="auto-load" /><label for="auto-load">Auto load</label></div>',
    urlsCook : 'GSTOOL-CONF-urls',
    cssCook : 'GSTOOL-CONF-css',
    autoCook:'GSTOOL-CONF-auto',
    
    
    createDiv : function(){
      var div = document.createElement('div');
      div.id = this.id;
      return div;
    },
    setDiv : function(){
      var self = this;
      this.div = getDefValue(document.getElementById(this.id), null, function (){return self.createDiv();});
      this.div.innerHTML = this.innerHTML;
      document.querySelector('body').appendChild(this.div);
      this.div.querySelector('#grst-urls').value = getCookie(this.urlsCook);
      if (getCookie(this.autoCook) == 1)
    	  this.div.querySelector("#auto-load").setAttribute("checked","checked");
      this.bind();
    },
    createCss : function()
    {
      var css = document.createElement('style');
      css.setAttribute('type','text/css');
      css.id = this.cssId;
      document.querySelector('head').appendChild(css);
      return css;
    },
    setCss : function(){
      var self = this;
      this.css = getDefValue(getCookie(this.cssCook), this.css);
      this.cssBlock = getDefValue(document.getElementById(this.cssId), null, function (){return self.createCss();});
      this.cssBlock.innerHTML = this.css;
    },
    bind : function(){
      var self = this;
      
      /*
       * funcao de inicio, abrindo os scripts
       */
      this.div.querySelector('#grst-start-btn').addEventListener('click', function(){
        var urlsStr = self.div.querySelector('#grst-urls').value;
        setCookie(self.urlsCook, urlsStr, {expires:365});
        var urls = urlsStr.split('\n');
        var timmer = 0;
        iterate(urls, function(){
        	var self = this;
       		setTimeout(function(){
	          if (self.valueOf() != "")
	          {
	            var scrpt = document.createElement('script');
	            scrpt.setAttribute('type','text/javascript');
	            scrpt.setAttribute('src', self.valueOf());
	            document.querySelector('head').appendChild(scrpt);
	          }
	        },timmer);
	        timmer += 100;
        });
      }, true);
      
      /*
       * Funcao de fechamento/abertura do div
       */
      this.div.querySelector('#grst-close-btn').addEventListener('click', function(){
      	addClass('closed', self.div)
      }, true);
      /*
       * Funcao de fechamento/abertura do div
       */
      this.div.querySelector('#grst-open-btn').addEventListener('click', function(){
      	removeClass('closed', self.div)
      }, true);
      
      /*
       * funcao de mudanca do cookie de autoloader
       */
      this.div.querySelector("#auto-load").addEventListener('change', function(){
    	  setCookie(self.autoCook, self.div.querySelector("#auto-load").checked ? 1 : 0, {expires:365});
      }, true);
    },
    start : function (){
      var self = this;
      setCookie('GSTOOL-CONF-style', self.style);
      this.setCss();
      this.setDiv();
      if (getCookie(this.autoCook) == 1)
    	  simulateClick(this.div.querySelector('#grst-start-btn'));
      addClass('closed',this.div);
      return self;
    }
  }).start();
};

/********************************************************
 ********************************************************
 * basic functions
 ********************************************************
 ********************************************************/

function simulateClick(ele)
{
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,
	    0, 0, 0, 0, 0, false, false, false, false, 0, null);
  ele; 
  ele.dispatchEvent(evt);
}

function getDefValue(val, def, func)
{
  if (typeof val == "undefined" || val === null)
    val = (typeof func == "function") ? func() : def;
  return val;
}

/**
 * @brief adds a class to an element
 */
function addClass(cla, e)
{
  claArr = e.className.split(" ");
  claArr.push(cla);
  claArr.sort();
  e.className = claArr.join(" ");
}

/**
 * @brief removes a class from an element
 */
function removeClass(cla, e)
{
  var claArr = e.className.split(" ");
  claArr.sort();
  for (var i = 0; i < claArr.lenght || cla > claArr[i]; i++) ;
  var begin = claArr.slice(0, i);
  var end = claArr.slice(i); 
  while (cla == end[0]) end.shift();
  claArr = begin.concat(end);
  e.className = claArr.join(" ");
}


/**
 * @brief sets an css property to an element
 */
function Style(e, prop, value)
{
  var style = e.getAttribute('style');
  if (typeof value != "undefined")
  {
    if (style == null)
      style = "";
    if (!style.match("^(.*;)*\\s*("+prop+"\\s*:\\s*[^;]*)(;.*)*$"))
      style = prop+":"+value+";"+style;
    else
    {
      str = style.match("\\s*"+prop+"\\s*:\\s*[^;]*;?")[0];
      if (value != null)
        style = style.replace(str, prop+":"+value+";");
      else
        style = style.replace(str, "");
    }
    e.setAttribute('style', style);
  }
  else
  {
    return style.match("\\s*"+prop+"\\s\*:\\s*([^;]*);?")[1];
  }
}

/**
 * @brief iterate a function through an array
 * @param a : array
 * @param f : function
 * @param arg : arguments array
 * @return nothing
 */
function iterate(a, f, arg)
{
  if (arg == null)
    arg = [];
  for (var i = 0; i < a.length; i++)
  {
    f.apply(a[i], arg);
  }
}


/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
setCookie = getCookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
startup();