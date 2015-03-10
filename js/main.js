
(function() {

	$('.hSlider, .vSlider').each(function(){

		$(this).on('change',function(){
			$('#' + this.id + 'Label').html($(this).data('interface').getValue().toFixed(2));
		});

	});

	$('.hSlider').each(function() {


		var $slider = $(this);
		var slider = new sliderNamespace.HSlider({
			view: $slider,
			min: $slider.data('min'),
			max: $slider.data('max'),
			snapValue: $slider.data('snap'),
			value: parseFloat($slider.attr('data-value'))
		});
	
	});

	$('.vSlider').each(function() {


		var $slider = $(this);
		var slider = new sliderNamespace.VSlider({
			view: $slider,
			min: $slider.data('min'),
			max: $slider.data('max'),
			snapValue: $slider.data('snap'),
			value: parseFloat($slider.attr('data-value'))
		});
		
	});



})();


// ----- testing only -----

(function() {
	
	$('.shortcuts > a').on('click', function (e) {
		e.preventDefault();
		var sliderId = '#slider' + $(this).parent().attr('id').replace('shortcuts', '');
		$(sliderId).data('interface').setValue(parseFloat($(this).text()));
	});

	setInterval(function() {
		console.log('slider values: ');
		$('.vSlider, .hSlider').each(function() {
			console.log('value: ' + $(this).data('interface').getValue()); //todo output in html
		});
	}, 3000);

})();