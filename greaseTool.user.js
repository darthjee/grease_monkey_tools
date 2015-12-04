// ==UserScript==
// @name            General GreaseMonkey Script
// @description     Script to be used with PW pages
// @include         *
// @version         1.0
// ==/UserScript==



tool = document.createElement('div');
tool.id="greaseTool";
tool.className = "closed";
tool.innerHTML="<div id='menu'></div><span id='open-btn'><a href='#' onclick='return false;'>Open</a></span><div id='tool-content'></div>";

menu = new Menu();
convertCss(menu);
menu.addLink('close-btn', 'Close');

window.addEventListener("load", function() {
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML="#greaseTool\n{\n position: fixed;\n  top: 80px;\n    right:20px;\n   z-index:900;\n  background:#eeeeee;\n   padding:7px;\n}\n\n#greaseTool #menu\n{\n  text-alig:left;\n  height:30px;\n}\n\n#greaseTool #tool-content form\n{\n  text-align:left;\n}\n\n#greaseTool #tool-content textarea.full-textarea\n{\n  min-width:340px;\n}\n\n#greaseTool #tool-content label\n{\n  min-width:90px;\n  display:inline-table;\n  text-align:left;\n  font-weight:bold;\n}\n\n#greaseTool #tool-content input[type=text], #greaseTool #tool-content textarea\n{\n  min-width:250px;\n}\n\n#greaseTool #tool-content textarea\n{\n    min-height:100px;\n}\n\n#greaseTool #menu a\n{\n    background:#00aaff;\n   padding:2px;\n  color:white;\n  text-decoration:none;\n font-weight:bold;\n  padding:3px;\n  float:left;\n}\n#greaseTool #menu a.tool-btn\n{\n  margin:0 0 0 2px;\n}\n  \n#greaseTool #menu a#close-btn\n{\n    background:#ee0022;\n}\n\n#greaseTool.opened #open-btn\n{\n display: none;\n}\n\n#greaseTool.closed #menu, #greaseTool.closed #tool-content\n{\n    display: none;\n}\n\n#greaseTool #close-btn\n{\n    float:right;\n}\n\n#greaseTool #filler-tool textarea\n{\n   width:300px;\n  height:200px;\n}\n\n#greaseTool .button-blue input\n{\n margin:2px;\n}\n\n\n#form-gen-tool textarea\n{\n  width:500px;\n}\n\n#tool-content .roller\n{\n  overflow:auto;\n}";
  document.getElementsByTagName('head')[0].appendChild(style);

  document.body.appendChild(tool);

  menu.startup();


}, true);




/********************************************************
 ********************************************************
 * menus startup functions
 ********************************************************
 ********************************************************/
function convertCss(menu)
{
  extractHtml = "<form id='convert-css-tool'><div class='roller'><textarea id='full-css'></textarea><br /><input id='colapsed-css' type='text' /></div><div class='button-blue'><input type='button' id='convert-btn-colapse' value='colapse' /><input type='button' id='convert-btn-split' value='split' /></div></form>";
  menu.addLink('convert-css-btn', 'convertCss', 'convert-css-div', extractHtml, function(){
    document.querySelector('#convert-css-tool #convert-btn-colapse').addEventListener("click", function(){
      var text = document.querySelector('#convert-css-tool #full-css').value;
      text = text.split('\n').join('\\n');
      document.querySelector('#convert-css-tool #colapsed-css').value = text;
    }, true);
    document.querySelector('#convert-css-tool #convert-btn-split').addEventListener("click", function(){
      var text = document.querySelector('#convert-css-tool #colapsed-css').value;
      text = text.split('\\n').join('\n');
      document.querySelector('#convert-css-tool #full-css').value = text;
    }, true);
  });
}

/********************************************************
 ********************************************************
 * Menu controller basic functions
 ********************************************************
 ********************************************************/

/**
 * @brief menu controler class
 */
function Menu()
{
  var listMenu = [];
  var listTool = [];
  var list = [];
  var startUpList = [];
  this.addLink = function(id, text, toolDiv, content, startup)
  {
    if (toolDiv != null)
    {
      var str = "<a href='#"+toolDiv+"' onclick='return false;' id='"+id+"' class='tool-btn'>"+text+"</a>";
      listTool[toolDiv] = content;
      list.push(toolDiv);
      startUpList.push(startup);
    }
    else
      var str = "<a href='#' onclick='return false;' id='"+id+"'>"+text+"</a>";
    listMenu.push(str);
  };

  this.render = function()
  {
    document.querySelector('#greaseTool #menu').innerHTML=listMenu.join(" ");
    listDiv = [];
    for (i = 0; i < list.length; i++)
    {
      id = list[i];
      content = listTool[id];
      listDiv.push("<div id='"+id+"' class='tool-display' style='display:none'>"+content+"</div>");
    }
    document.querySelector('#greaseTool #tool-content').innerHTML=listDiv.join("");
    openToolBox(document.querySelector('#greaseTool #menu *'));
  };

  this.startup = function()
  {
    this.render();
    document.querySelector('#greaseTool #open-btn').addEventListener("click", function()
    {
      openTool();
    }, true);

    document.querySelector('#greaseTool #close-btn').addEventListener("click", function()
    {
      closeTool();
    }, true);

    iterate(document.querySelectorAll('#greaseTool #menu .tool-btn'), function(){
      this.addEventListener("click", function()
      {
        openToolBox(this);
      }, true);
    });

    for (var i = 0; i < startUpList.length; i++)
    {
      if (startUpList[i] != null)
        startUpList[i]();
    }
  };

  function openTool()
  {
    removeClass('closed', document.querySelector('#greaseTool'));
    addClass('opened', document.querySelector('#greaseTool'));
  }
  function closeTool()
  {
    removeClass('opened', document.querySelector('#greaseTool'));
    addClass('closed', document.querySelector('#greaseTool'));
  }

  function openToolBox(e)
  {
    div = e.getAttribute('href');
    divs = document.querySelectorAll('#greaseTool #tool-content .tool-display');
    iterate(divs, function(){Style(this, 'display', 'none');});
    Style(document.querySelector('#greaseTool #tool-content '+div), 'display', null);
  }

}


/********************************************************
 ********************************************************
 * basic functions
 ********************************************************
 ********************************************************/

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
  claArr = e.className.split(" ");
  claArr.sort();
  for (i = 0; i < claArr.lenght || cla > claArr[i]; i++) ;
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
  for (i = 0; i < a.length; i++)
  {
    f.apply(a[i], arg);
  }
}


