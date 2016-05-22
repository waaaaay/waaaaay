(function($) {

// DM Menu
		jQuery('.nav').onePageNav();
		jQuery('#navigation-container').height($("#nav").height());
		jQuery('#nav').affix({
			offset: { top: $('#nav').offset().top }
	});
			
// Back to Top
 jQuery(window).scroll(function(){
	if (jQuery(this).scrollTop() > 1) {
			jQuery('.dmtop').css({bottom:"25px"});
		} else {
			jQuery('.dmtop').css({bottom:"-100px"});
		}
	});
	jQuery('.dmtop').click(function(){
		jQuery('html, body').animate({scrollTop: '0px'}, 800);
		return false;
});
})(jQuery);

var w = $(window).width();
	if(w > 960){
	$('.slider').parallax("50%", -0.3);
	$('.testimonials').parallax("50%", -0.3);
	$('.twitter-feed').parallax("50%", -0.2);
	$('.call-to-action').parallax("50%", -0.2);
	$('.zoomer-bg').parallax("50%", -0.6);	
}

$('html').niceScroll({
	horizrailenabled: false,
	autohidemode: false
});
