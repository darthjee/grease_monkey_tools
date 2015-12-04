/**
 * @brief list de dados mapeados
 */
(function($){
  if ($.mappedList != "function"){
    var mappedList = null;
    mappedList = function(model)
    {
      if (this.constructor == mappedList)
      {
        this.props = {};
        this.keys = [];
        if (typeof model != "undefined")
        {
          if (model.constructor == mappedList)
          {
            $.extend(true, this.props, model.props);
          }
          else if (model.constructor == Array)
          {
            for (var i = 0; i < model.length; i++)
            {
              this.props[i] = model[i];
            }
          }
          else if (typeof model == "object")
          {
            $.extend(true, this.props, model);
          }
          this.length = 0;
          for (prop in this.props)
          {
            this.keys.push(prop);
            this.length++;
          }
        }
      }
      else
        return new mappedList(model);
    }; 
    
    mappedList.prototype.remap = function(oldk, newk)
    {
      this.put(newk,this.get(newk));
      this.remove(oldk);
    };
    mappedList.prototype.get = function(key)
    {
      return this.props[key];
    };
    mappedList.prototype.put = function(key, val)
    {
      if (typeof this.props[key] != "undefined")
        this.remove(key);
      else
        this.keys.push(key);
      this.props[key] = val;
      this.length++;
    };
    mappedList.prototype.remove = function(key)
    {
      var ret = null;
      if (typeof this.props[key] != "undefined")
      {
        ret = this.props[key];
        delete this.props[key];
        for (var i = 0; i < this.keys.length; i++)
          if (this.keys[i] == key)
            delete this.keys[i--];
        this.length--;
      };
      return ret;
    };
    mappedList.prototype.getKeys = function()
    {
      var ret = [];
      for (var i = 0; i < this.keys.length; i++)
        ret.push(this.keys[i]);
    };
    

    $.mappedList = mappedList;
  }
})(jQuery);
