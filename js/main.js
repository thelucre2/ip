frameSize = 250;
startingValue = 10;
var colorMatrix = new Array();
var canvas = $('canvas');
var loader = $('#loader');
var areaOriginal = $('#area-original');
var goButton = $('#btn-get-image');
var settings = {
	'frameSize' 		: 250,
	'startingSize' 		: 10,
	'failTimeout' 		: 20000,
	'fadeSlow'			: 1500,
	'fadeMed'			: 800,
	'fadeFast'			: 400
};

$(document).ready( function() {
	//$("#console").hide();

	loader.hide();
	$('canvas').hide();
	areaOriginal.hide();
	goButton.attr("disabled", true);


	$( "#slider" ).slider({ 
		orientation: "vertical", 
		min: 3,
		max: 30,
		change: function( event, ui ) {
			// ON SET SLIDER VALUE
			//updatePixelatedImage(ui.value);
		},
		slide: function( event, ui ) {
			// ON SLIDER MOVE
			updatePixelatedImage(ui.value);
		}
	 });

	$('#btn-get-image').click( function() {
		goButton.attr("disabled", true);
		callForImage();
	});

	$('#save').click(function(){
	  var dataURL = canvas[0].toDataURL("image/png");
	  open().document.write('<img src="'+dataURL+'"/>');
	  return false;
	});
	$('#scale').click(function(){
	  scaleCanvas($( "#slider" ).slider( "option", "value"), 10);
	  return false;
	});

	 $( "#slider" ).slider( "option", "value", settings.startingSize );
	 callForImage();
});

function updatePixelatedImage(size) {
	var tmp = $('<div/>').insertBefore('canvas'),
    	canvas = $('canvas').detach();

	canvas.clearCanvas();

	canvas.draw({
	  fn: function(ctx) {
	  	ctx.canvas.width = colorMatrix.length;
	  	ctx.canvas.height = colorMatrix[0].length;

	  	var tiles = { 'x': Math.floor(ctx.canvas.width / size),
	  				  'y': Math.floor(ctx.canvas.height / size) };

	  	var pad = { 'x': ctx.canvas.width % size,
	  				'y': ctx.canvas.height % size };

	  	var padCount = { 'x' : 0,
	  				   'y' : 0 };
	  	if( pad.x > 0) padCount.x = -1;

		for(var x = 0; x < tiles.x; x++) {
			var plus = { 'x':0, 'y':0 };
			padCount.y = 0;
			if (padCount.x < pad.x) { padCount.x++; plus.x++; } 
			if( pad.y > 0) padCount.y = -1;
		    for(var y = 0; y < tiles.y; y++) {  
		    	if (padCount.y < pad.y) { padCount.y++; plus.y++; }
				var colorCoords = { 'x': Math.floor(x * size + size + plus.x - size / 2),
								 'y': Math.floor(y * size + size + plus.y - size / 2) };
		        ctx.fillStyle = "#" + colorMatrix[colorCoords.x][colorCoords.y];
	    		ctx.fillRect(x * size + padCount.x, y * size + padCount.y, 
	    			x * size + size + plus.x, 
	    			y * size + size + plus.y );
			}
		}
	  } 
	});

	tmp.replaceWith(canvas);
}

function callForImage() {
	loader.fadeIn(settings.fadeMed);
	$('canvas').fadeOut(settings.fadeMed);
	areaOriginal.fadeOut(settings.fadeMed);

	var instalink = $('input.image-source').val();

   	var url = "./getImage.php";

   	$.ajax({ 
    	url: url,
	    data: {action: 'getImage', src: instalink},
        type: 'post',        
        timeout: settings.failTimeout,
	}).done(function (data) {
		try {
			var json = JSON.parse(data);
		    var details = json;
		    switch(details.status) {
		    	case 'success':
		    		var imgsrc = details.src;
		    		/*
			    	var normalImg = $("#area-original").find('img');
			    	normalImg.attr('src', imgsrc);
			    	normalImg.attr('width', settings.frameSize);
			    	normalImg.attr('height', settings.frameSize);
					*/
			        colorMatrix = details.colors;
			        updatePixelatedImage($( "#slider" ).slider( "option", "value"));

			        $('canvas').fadeIn(settings.fadeMed);
			        areaOriginal.fadeIn(settings.fadeFast);
			        break;

			    case 'failure':
			    	alert('PHP: shit failed\n' + 
			    		  details.msg + '\n' +
			    		  details.stack);


			}
    	}
		catch(err) {
			console.log(err);
		}
		

	}).fail(function (jqXHR, textStatus) {
	    alert('JS: shit failed');
	}).always( function() {
		loader.fadeOut(settings.fadeMed);
		goButton.attr("disabled", false);
	});	
	
}

function scaleCanvas(size, mult) {
	var ca = document.createElement('canvas');
	var nctx = ca.getContext('2d');
	ca.width = 612 * mult;
	ca.height = 612 * mult;
	console.log(colorMatrix);
	size *= mult;
	
	var tiles = { 'x': Math.floor(ca.width / size),
			  'y': Math.floor(ca.height / size) };

	
	for(var x = 0; x < tiles.x; x ++) {
		for(var y = 0; y < tiles.y; y++) {
			var colorPoints = {
					'x': Math.floor(x/tiles.x*colorMatrix.length),
					'y': Math.floor(y/tiles.y*colorMatrix[0].length)
			};
			//console.log(colorPoints.x + ', ' + colorPoints.y);
			
			nctx.fillStyle = "#" + colorMatrix[colorPoints.x][colorPoints.y];
			nctx.fillRect(x*size, y*size, 
					x*size + size, 
					y*size + size);
		}
	}
	
	
	var pad = { 'x': ca.width % size,
				'y': ca.height % size };
	
	var padCount = { 'x' : 0,
				   'y' : 0 };
	
	if( pad.x > 0) padCount.x = -1;
	
	/*
	 * 612 px
	 * 1 = 5
	 * 
	 * for(var x = 0; x < tiles.x; x++) {
		var plus = { 'x':0, 'y':0 };
		padCount.y = 0;
		if (padCount.x < pad.x) { padCount.x++; plus.x++; } 
		if( pad.y > 0) padCount.y = -1;
	  for(var y = 0; y < tiles.y; y++) {  
	  	if (padCount.y < pad.y) { padCount.y++; plus.y++; }
			var colorCoords = { 'x': Math.floor(x * size + size + plus.x - size / 2),
							 	'y': Math.floor(y * size + size + plus.y - size / 2) };
			console.log(colorCoords.x + ', ' + colorCoords.y);
	      nctx.fillStyle = "#" + colorMatrix[colorCoords.x][colorCoords.y];
		  nctx.fillRect(x * size + padCount.x, y * size + padCount.y, 
				x * size + size + plus.x, 
				y * size + size + plus.y );
		}
	}*/

	var dataURL = ca.toDataURL("image/png");
	open().document.write('<img src="'+dataURL+'"/>');
}










