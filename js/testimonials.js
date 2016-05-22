// Testimonials
	if($('#dm-testimonials').length){
		$('.testimonial-nav').each(function(){
		    var container = $(this),
		    	children = container.children('li');
		    children.sort(function(a,b){
		          var temp = parseInt( Math.random()*10 );
		          var isOddOrEven = temp%2;
		          var isPosOrNeg = temp>5 ? 1 : -1;
		          return( isOddOrEven*isPosOrNeg );
		    }).appendTo(container);            
		});		
		var len=$(".testimonial").length;
		var index=0;
		var int;
		function auto_move(){
			if(index==len-1)
			index=0;
			$('#dm-testimonials .testimonial-nav a,#dm-testimonials .testimonial').removeClass('active');
			var obj=$('#dm-testimonials .testimonial-nav a:eq('+index+')');
			obj.addClass('active');
			$(obj.attr('href')).addClass('active');
			index++;
		}
		auto_move();
		int=setInterval(function(){auto_move();},4000);
		$('#dm-testimonials .testimonial-nav a').each(function(e, element) {
			$(this).hover(function(){
				$('#dm-testimonials .testimonial-nav a,#dm-testimonials .testimonial').removeClass('active');
				$(this).addClass('active');
				$($(this).attr('href')).addClass('active');
				clearInterval(int);
			},function(){
				index=e;
				int=setInterval(function(){auto_move();},4000);
			});
        });
		$('#dm-testimonials .testimonial-nav a').click(function(){ return false; });
	}