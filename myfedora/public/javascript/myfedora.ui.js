

/******** base widget class ********/
var _base_widget = function(block_id) {
  if (typeof(menu_id) == "string")
    {
      this.block = jQuery("#" + block_id);
    } 
  else
    {
      this.block = block_id;
    }
};

_base_widget.prototype = {
  block: undefined,
  show_effect: undefined,
  hide_effect: undefined, 
  setup: function() {
    this.hide();
  },
  
  hide: function() {
    this.block.hide();
  },
  
  show: function() {
    this.block.show();
  },
  
  fancy_hide: function() {
    var block = this.block;
    
    if (!this.hide_effect)
      {
        this.hide();
      }
    else
      {
        
        eval("block." + this.hide_effect);
      }
  },
  
  fancy_show: function() {
    var block = this.block;
    
    if (!this.show_effect)
      {
        this.show();
      }
    else
      {
        eval("block." + this.show_effect);
      }
  },
  
  set_show_effect: function(effect) {
    this.show_effect = effect;
  },
  
  set_hide_effect: function(effect) {
     this.hide_effect = effect;
  }
  
};

/******** hover menu class ********/
var _hover_menu = function(menu_id) {
  var parent = new _base_widget(menu_id);
  myfedora.inherit(this, parent);
  this.setup();
  
  this.menu_parent = this.menu.parent();
 
  var self = this;
  this.menu_parent.hover(function() {
                           
                           self.fancy_show();
                           
                         },
                         function() {
                           
                           self.fancy_hide();
                    
                         });
};

_hover_menu.prototype = {
};

/******** click menu class ********/


/******** lightbox class **********/

var _lightbox = function(block_id, zindex) {
  this.index = zindex;
  var parent = new _base_widget(block_id);
  myfedora.inherit(this, parent);
  this.setup();
  
  
  var dark_box = jQuery("<div />").css({"z-index": zindex,
                                        "background-color": "black",
                                        "opacity": "1",
                                        "position": "absolute",
                                        "height": "100%",
                                        "width": "100%",
                                        "left": 0,
                                        "top": 0,
                                       });
                                       
  dark_box.hide()
  
  var content = this.block.replaceWith(dark_box);
  content.show();
  this.block = dark_box;
  
  var light_box = jQuery("<div />").css({"background-color": "white",
                                         "opacity": "1",
                                         "height": "80%",
                                         "width": "90%",
                                         "margin-left": "auto",
                                         "margin-right": "auto",
                                         "padding": "20px"
                                        });
  var content_box = jQuery("<div />").css({"overflow":"auto", "height":"90%"});
  content_box.append(content);
  
  var self = this;
  var hide = function (){
    self.fancy_hide(); 
    return false;
  }
  
  var close_link = jQuery("<a href='#'/>").text("[X]Close").click(hide);           
  light_box.append(close_link);
  light_box.append(content_box);
  light_box.append(close_link.clone(true));
  dark_box.append(light_box);
};

_lightbox.prototype = {
};

/******** ellipsized text class ********/
var _ellipsized_text = function(blockid, morelink_text, lesslink_text, max_len) {
  this.div = jQuery('#' + blockid);
  this.morelink_text = morelink_text;
  this.lesslink_text = lesslink_text;
  this.max_len = max_len;

};

_ellipsized_text.prototype =  {
  calc_ellipse: function(html, size) {
    var text = this.div.text();
    
    if (text.length > this.max_len)
        text = text.substr(0, this.max_len) + '...';
        
    var result = jQuery('<span />');
    result.append(text);
    
    return result
  },
  
  sanitize_tags: function() {
    // add a blank target to links
    var a = jQuery('a', this.div);
    a.attr('target', '_blank');
  },
  
  show: function() {
    var self = this;  
    this.div.hide();
    
    this.html = jQuery('<div/>').html(this.div.html());

    this.div.parent().append(this.html);
    this.light_box = new myfedora.ui.lightbox(this.html, 5);
    this.light_box.show_effect = 'fadeIn()'
    this.light_box.hide_effect = 'fadeOut()'
    this.sanitize_tags();

    var el = this.calc_ellipse(this.div, this.max_len);
      
      
    s = jQuery('<span />').text(' [');
    a = jQuery('<a/>').attr('href', '#').text(this.morelink_text);
      
    this.lessdiv = el
      
    this.div.html(el);
      
      
    a.click(function() {self.unellipsize(self); return false;});
    s.append(a);
    s.append(']');
    el.append(s);
    
    this.div.show();
  },
  
  unellipsize: function(self) {
    self.light_box.fancy_show();
  },
  
  ellipsize: function(self) {

    self.div.html(self.lessdiv);
    self.div.show();
  },
};


/******** construct the UI module ********/
var _ui = function(){};

_ui = {
  base_widget: _base_widget, 
  hover_menu: _hover_menu,
  lightbox: _lightbox,
  ellipsized_text: _ellipsized_text,
  
  generate_widget_param_url: function(id, req_params) {
    var query_string = document.location.search;
    var path = document.location.pathname;
    var elements = myfedora.parse_query_string(query_string);
    
    if (! elements) {
      elements = {};
    }
    
    for (var k in req_params) {
      var kid = id + "_" + k;
      elements[kid] = req_params[k];
    }
    
    query_string = "?";
    var add_amp = false;
    for (var k in elements) {
      if (add_amp) { 
        k += "&"; 
      } else {
        add_amp = true;
      }
      
      query_string += k + "=" + elements[k];
    }
    
    return path + query_string;
  },
  
  go_to: function(id, req_params) {
    document.location.href = myfedora.ui.generate_widget_param_url(id, req_params);
  }
};

myfedora.ui = _ui;

