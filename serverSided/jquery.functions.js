(function($){
	$.fn.toggleDisplay = function(){
		if (this.is(':hidden'))
			this.show();
		else
			this.hide();
	};
})(jQuery);
