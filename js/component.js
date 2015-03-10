
var sliderNamespace = (function(){

	var Slider = function(config) {
		this.$view = config.view;

		// create dom children
		this.$view.append('<div class="track"></div><div class="thumb"></div>');

		this.$track = this.$view.find('.track');
		this.$thumb = this.$view.find('.thumb');


		this.$thumb.append('<div class="tooltip"><div></div></div><div class="tooltipPointer"></div>');

		//check config
		// var value = (isNaN(config.value) ? 0 : config.value);
		this.minValue = (isNaN(config.min) ? 0 : config.min);
		this.maxValue = (isNaN(config.max) ? 100 : config.max);

		if(config.snapValue && this.maxValue % config.snapValue == 0){
			this.snapValue = config.snapValue;
		} else {
			this.snapValue = 0;
		}

		this.$view.on('mousedown', this.onMouseDownHandler.bind(this));

		//temporarily api
		this.$view.data('interface', {
			setValue: this.setValue.bind(this),
			getValue: this.getValue.bind(this)
		});

		this.addTooltipUpdate();

	}

	Slider.prototype.addTooltipUpdate = function(){
		var that = this;

		this.$view.on('change',function(e){

			that.$thumb.find('.tooltip div').html(that.getValue().toFixed(2));

		});

	}

	Slider.prototype.showTooltip = function(){
		this.$thumb.find('.tooltip').css('max-height','30px');
		this.$thumb.find('.tooltip').css('background','#0099CC');
		this.$thumb.find('.tooltip').css('top','-37px');
		this.$thumb.find('.tooltipPointer').css('border-top','7px solid #0099CC');
	}

	Slider.prototype.hideTooltip = function(){
		this.$thumb.find('.tooltip').css('max-height','0px');
		this.$thumb.find('.tooltip').css('background','black');
		this.$thumb.find('.tooltip').css('top','-7px');
		this.$thumb.find('.tooltipPointer').css('border-top','0px solid black');
	}

	Slider.prototype.moveToNextSnap = function(val){
		if(this.snapValue == 0) return val;

		var distance = Math.abs(val % this.snapValue);

		if(val < 0){
			if(distance < (this.snapValue/2)){

				return val + distance;

			} else {

				return val - (this.snapValue - distance);

			}			
		}
		else
		{

			if(distance < (this.snapValue/2)){

				return val - distance;

			} else {

				return val + (this.snapValue - distance);

			}
		}
	}

	Slider.prototype.onMouseDownHandler = function onMouseDownHandler(e) {
		this.$view.addClass('active');
		var dragOffsetX = 0;

		if(e.target == this.$thumb[0]) {
			//thumb
			dragOffsetX = e.pageX - this.$thumb.offset().left;
		} else {
			//track
			dragOffsetX = this.thumbLength/2;
			this.setValueByPageCoordinate(e.pageX, dragOffsetX);
		}



		var that = this; //now we save this instead of bind
		$(window).on('mousemove', function(e) {
			that.showTooltip();
			that.$thumb.css('transition', 'left 0ms');
			that.setValueByPageCoordinate(e.pageX, dragOffsetX);
			e.preventDefault();
		});

		$(window).on('mouseup', function(e) {
			that.$thumb.css('transition', 'left 300ms');
			that.hideTooltip();
			$(window).off('mousemove').off('mouseup');
			that.$view.removeClass('active');
			e.preventDefault();
		});
		e.preventDefault(); //otherwise text cursor
	};

	Slider.prototype.valueToPosition = function valueToPosition(value) {
		var position = (value - this.minValue)/(this.maxValue - this.minValue) * (this.trackLength - this.thumbLength); //our thumb position
		return position;
	};

	Slider.prototype.positionToValue = function positionToValue(position) {
		return position/(this.trackLength - this.thumbLength) * (this.maxValue - this.minValue) + this.minValue;
	};

	Slider.prototype.setValueByPageCoordinate = function setValueByPageCoordinate(pageCor, dragOffset) {
		//min: 0
		//max: this.trackLength - thumbLength
		var position = Math.max(0, Math.min(pageCor - this.trackDistance - dragOffset, this.trackLength - this.thumbLength));
		this.setValue(this.positionToValue(position));
	};

	var HSlider = function(config){

		var value;
		var value = (isNaN(config.value) ? 0 : config.value);

		this.setValue = function(newValue){
			value = this.moveToNextSnap(newValue);
			// position updaten

			this.$thumb.css('left', this.valueToPosition(value));
			this.$view.trigger('change');			
		}

		this.getValue = function(){
			return value;
		}

		Slider.call(this,config);

		this.trackLength = this.$track.width();
		this.thumbLength = this.$thumb.width();
		this.trackDistance = this.$track.offset().left;

		if(this.snapValue){ this.addSnapLines(); }
		

		this.setValue(value);		
	}

	HSlider.prototype = Object.create(Slider.prototype);

	HSlider.prototype.addSnapLines = function(){
		var num = (this.maxValue - this.minValue) / this.snapValue;

		for( var i = 0 ; i < num ; i++ ){
			this.$track.append('<div class="snapLine"></div>');
		}

		var widthInPercent = 100 / num;
		var widthInPx = (this.$track.width() - this.$thumb.width()) / 100 * widthInPercent;
		
		this.$track.find('.snapLine:first-child').css('margin-left', (this.$thumb.width()/2) + "px");
		this.$track.find('.snapLine:last-child').css('border-right', '1px solid rgba(255,255,255,0.7)');
		this.$track.find('.snapLine').css('width', widthInPx + 'px');
		this.$track.find('.snapLine').css('height', '100%');
	}

	var VSlider = function(config){

		var value;
		var value = (isNaN(config.value) ? 0 : config.value);

		this.setValue = function(newValue){
			value = this.moveToNextSnap(newValue);
			// position updaten

			// this.$thumb.animate({
			// 	top: this.valueToPosition(value)
			// }, 300, 'linear');

			this.$thumb.css('top', this.valueToPosition(value));

			this.$view.trigger('change');			
		}

		this.getValue = function(){
			return value;
		}

		Slider.call(this,config);

		this.trackLength = this.$track.height();
		this.thumbLength = this.$thumb.height();
		this.trackDistance = this.$track.offset().top;

		if(this.snapValue){ this.addSnapLines(); }

		this.setValue(value);

	}

	VSlider.prototype = Object.create(Slider.prototype);

	VSlider.prototype.showTooltip = function(){
		this.$thumb.find('.tooltip').css('max-width','50px');
		this.$thumb.find('.tooltip').css('background','#0099CC');
		this.$thumb.find('.tooltipPointer').css('border-top','7px solid #0099CC');
		this.$thumb.find('.tooltipPointer').css('left','13px');
	}

	VSlider.prototype.hideTooltip = function(){
		this.$thumb.find('.tooltip').css('max-width','0px');
		this.$thumb.find('.tooltip').css('background','black');
		this.$thumb.find('.tooltipPointer').css('border-top','0px solid black');
		this.$thumb.find('.tooltipPointer').css('left','17px');
	}

	VSlider.prototype.addSnapLines = function(){
		var num = (this.maxValue - this.minValue) / this.snapValue;


		for( var i = 0 ; i < num ; i++ ){
			this.$track.append('<div class="snapLine"></div>');
		}

		var widthInPercent = 100 / num;
		var widthInPx = (this.$track.height() - this.$thumb.height()) / 100 * widthInPercent;
		
		this.$track.find('.snapLine:first-child').css('margin-top', (this.$thumb.height()/2) + "px");
		this.$track.find('.snapLine:last-child').css('border-bottom', '1px solid rgba(255,255,255,0.7)');
		this.$track.find('.snapLine').css('height', widthInPx + 'px');
		this.$track.find('.snapLine').css('width', '100%');
	}

	VSlider.prototype.onMouseDownHandler = function onMouseDownHandler(e) {
		this.$view.addClass('active');
		var dragOffsetY = 0;
		if(e.target == this.$thumb[0]) {
			//thumb
			dragOffsetY = e.pageY - this.$thumb.offset().top;
		} else {
			//track
			dragOffsetY = this.thumbLength/2;
			this.setValueByPageCoordinate(e.pageY, dragOffsetY);
		}

		var that = this; //now we save this instead of bind
		$(window).on('mousemove', function(e) {
			that.showTooltip();
			that.$thumb.css('transition', 'top 0ms');
			that.setValueByPageCoordinate(e.pageY, dragOffsetY);
			e.preventDefault();
		});

		$(window).on('mouseup', function(e) {
			that.$thumb.css('transition', 'top 300ms');
			that.hideTooltip();
			$(window).off('mousemove').off('mouseup');
			that.$view.removeClass('active');
			e.preventDefault();
		});
		e.preventDefault(); //otherwise text cursor
	};


	return {
		HSlider: HSlider,
		VSlider: VSlider
	}

})();

