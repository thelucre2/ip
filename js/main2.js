// GLOBALS! :)
var img;	// image object to store the incoming insta
var pix;	// big array of colors! 
var pixsize;	// keeps track of slider size after changes (easy viewing)
var canvdraw;	// canvas that we actually draw to the screen
var ctxdraw;

var canvimg;     // canvas that hols the base64 image raw (for reading pixels)
var ctximg;
var thumblist = [];
var thumbcount = 0;

$(document).ready( function() {

	setupEventHandlers();
	beginPixelationProcess("test5.jpg");

});
function changeCanvasSize(canvasElement, squareSize) {
	canvasElement.width = Math.min(squareSize  - 30, 612);
	canvasElement.height = Math.min(squareSize  - 30, 612);
	drawPixelatedToCanvas(getSliderValue(), true, null);
}

function getSliderValue() {
	return $( SLIDER ).slider( "option", "value");
}

/*********************************************
 * the initial AJAX call, buffer canvas drawing
 * and grabbing of the pixel color data
 *********************************************/
function beginPixelationProcess(urlimg) {
	// display loaders
	toggleLoader( true, 'original' );
	toggleLoader( true, 'canvas' );
	// jquery ajax here
	console.log("LOADING: " + urlimg);
	$.ajax({ 
    	url: 'test.php?q=getInstaImage',
	    data: {src: urlimg},
        type: 'post'

	}).done(function (data) {
		try {
			var json = JSON.parse(data); // need some check here...
		    //console.log(data);

		    // when done build the new image, set hte source and onoad callback
			img = new Image();
			img.src = json.src; // our source data
			img.id  = ORIGINAL_IMAGE.substring(1);

		    img.onload = function () {	// our image is out of the oven
		    	toggleLoader( false, 'original' );
		    	toggleLoader( false, 'canvas' );
				canvimg = document.createElement("canvas");
				ctximg = canvimg.getContext("2d");
				canvimg.width = img.width;
			    canvimg.height = img.height;
			    canvimg.id = MAIN_CANVAS.substring(1);
			    ctximg.drawImage( img, 0, 0 );
			    $( ORIGINAL_IMAGE ).replaceWith(img);
			    getPixelDataArray( );
				drawPixelatedToCanvas( getSliderValue(), true, null);
				// all done, activate GUI buttons and things
				console.log('toggling');
				//toggleGUI( 'enabled', 'save' );
				toggleLoader(false, 'canvas' );
			};
		} 
	catch(err) {
			console.log(err);
		}
	});	
}

/*********************************************
 * loads the pix vairable with pixel data from 
 * the buffered canvimg canvas
 *********************************************/
function getPixelDataArray() {
	
	var imageData = ctximg.getImageData(0, 0, canvimg.width, canvimg.height);
    var data = imageData.data;
    pix = { };
    // iterate over all pixels based on x and y coordinates
    for(var y = 0; y < img.height; y++) {
      pix[y] = { };
      // loop per row index
      for(var x = 0; x < img.width; x++) {
        var red = data[((img.width * y) + x) * 4];
        var green = data[((img.width * y) + x) * 4 + 1];
        var blue = data[((img.width * y) + x) * 4 + 2];
        // push onto array
        pix[y][x] = 'rgb(' + red + ',' + green + ',' + blue + ')';	
      }
    }
} // end getPixelDataArray()


/*********************************************
 * draws the pixel array to canvas with a 
 * specific square size the squares are 
 * adjusted in the offset for non 612x612 
 * combinations. this is bulk of the logic! ^_^
 *********************************************/
function drawPixelatedToCanvas(tilesize, isMainDrawingArea, canvassize) {
	// detach the dom element to save some gfx processing flops
	var tmp, tmpcanvas, tmpctx, tmpcanvelem;
	if(isMainDrawingArea) {
		tmp = $('<div/>').insertBefore('canvas');
	    tmpcanvelem = $( MAIN_CANVAS ).detach();
	    tmpcanvas = tmpcanvelem.get(0);
	    tmpctx = tmpcanvas.getContext("2d");
	} else { 
		tmpcanvas = document.createElement("canvas");
		tmpctx = tmpcanvas.getContext("2d");
		tmpcanvas.width = canvassize;
	    tmpcanvas.height = canvassize;
	    tmpcanvas.id = HI_RES_BTNS.substring(1);
	}

	

	// amount to scale each pixel drawn for cnavas size
	var canvscale = tmpcanvas.width / 612; // 0.490196078

	// size of the tile to be drawn
	var canvtile = tilesize * canvscale;

	// number of pixels in row or column (scaled for canvas size)
	var tiles = { 'x': Math.floor(612 / tilesize)	,
	  		  	  'y': Math.floor(612 / tilesize) };

	// pad values used to make the number of square tiles even given any size canvas
	// so there will appear to be a perfect fit for all squares drawn
	var pad = { 'x': tmpcanvas.width % canvtile,
	  			'y': tmpcanvas.height % canvtile };	// the total extra space on the canvas
	var padamt = { 'x' : pad.x / tiles.x,
				   'y' : pad.y / tiles.y };			// the padding per square that will be added to both sides

	for(var x = 0; x < tiles.x; x++) {
	    for(var y = 0; y < tiles.y; y++) { 
	    	//console.log(x + ", " + y);
			var colorCoords = { 'x': Math.floor(x * tilesize + tilesize / 2),
							 'y': Math.floor(y * tilesize + tilesize / 2) };

			if(colorCoords.x <= 0 ) colorCoords.x = 1;
			if(colorCoords.y <= 0) colorCoords.y = 1;
			if(colorCoords.x > 612 -1 ) colorCoords.x = 612 -1;
			if(colorCoords.y > 612 -1) colorCoords.y = 612 -1;
			console.log(colorCoords.x + " , " + colorCoords.y);{}
			if(pix[colorCoords.y] && pix[colorCoords.y][colorCoords.x]) {
		        tmpctx.fillStyle = pix[colorCoords.y][colorCoords.x];
				tmpctx.fillRect(	Math.floor(x * canvtile + x * padamt.x), 
								Math.floor(y * canvtile + y * padamt.y), 
								Math.floor((x * canvtile + x * padamt.x ) + canvtile + padamt.x),
								Math.floor((y * canvtile ) + canvtile + padamt.y ));
			}
		}
	}

	if(isMainDrawingArea) {
		// reset the dom element
		tmp.replaceWith(tmpcanvas);
	}

	return tmpcanvas;

} // end drawPixelatedToCanvas(size)


function saveCanvasImage() {

} // end saveCanvasImage()


function renderPrintImage(size) {  // size in inches ^_^

} // end renderPrintImage(size)


function resetDefaults() {

} // end resetDefaults()

function getInstagramUserId() {
	// CHANGE THE FRICKEN ACCESS TOKEN!
	//https://api.instagram.com/v1/users/search?q=   + thelucre   +   &access_token=43653944.59a3a9f.cbdc471769354bfa95dd55ef414a3dae&callback=?
	// returns 30815534	
	var username = $('#user-name').val();
	console.log(username);
	$.ajax({ 
    	url: "test.php?q=getUserId",
    	data : { 'url' : "https://api.instagram.com/v1/users/search?q=" + username + "&access_token=43653944.59a3a9f.cbdc471769354bfa95dd55ef414a3dae&callback=" },
        type: 'post'

	}).done(function (data) {
		try {
			var json = JSON.parse(data); // need some check here...
		    console.log(json);
		    var users = json.data;
		    for(var i = 0; i < users.length; i++) {
		    	console.log(users[i].username)
		    	if(users[i].username == username) {
		    		console.log("user id found : " + username + ", id : " + users[i].id);
		    		getUserInstagramFeed( users[i].id );
		    		return;
		    	}
		    }
		    alert( MSG_USER_NOT_FOUND );
		    toggleLoader( false, 'thumbs' );
		} 
	catch(err) {
			console.log(err);
		}
	});	
}

function getUserInstagramFeed( userid ) {
	// thelucre = 30815534
	console.log(userid);
	$.ajax({ 
    	url: "test.php?q=getUserImages",
    	data : { 'url' : "https://api.instagram.com/v1/users/" + userid + "/media/recent?access_token=43653944.59a3a9f.cbdc471769354bfa95dd55ef414a3dae&callback=" },
        type: 'post'

	}).done(function (data) {
		try {
			var json = JSON.parse(data); // need some check here...
		    console.log(json);
		    var images = json.data;

		    if(json.data.length > 1) {
		    	$( THUMBNAIL_CONTAINER ).find( THUMBNAIL_CLASS ).remove(); 

		    	for(var i = 0; i < images.length; i++) {
			    	var imagedata = {
			    		'hi' : images[i].images.standard_resolution.url,
			    		'lo' : images[i].images.low_resolution.url,
			    		'id' : thumbcount++
			    	};
			    	thumblist.push( imagedata );

			    	var tmpthumb = new Image();
			    	tmpthumb.src = imagedata.lo;
			    	tmpthumb.id = "thumb-" + imagedata.id;
			    	tmpthumb.className = "instathumb";
			    	$( THUMBNAIL_CONTAINER ).append(tmpthumb);
			    }
		    } else {
		    	alert( MSG_NO_IMAGES_FOUND );
		    }
		}
	catch(err) {
			alert( MSG_USER_IS_PRIVATE );
		}
	finally {
		toggleLoader( false, 'thumbs' );
		}
	});	
}

function canvasImagePopup(canvaselem) {
	var dataURL = canvaselem.toDataURL("image/png");
	open().document.write('<html><head><title>' + POPUP_TITLE + '</title><body><img src="'+dataURL+'" title="title text" alt="alt text"/></body></html>');
	return false;
}


function toggleGUI( turnOff, options ) {

	// slider
	if(options == 'all' || options == 'slider') {
		// figure out how to disable slider here
	}
	//save buttons
	if(options == 'all' || options == 'save') {
		// bootstrap etting to toggle buttons

		$( HI_RES_BTNS ).attr( {'disabled' : 'false' }); 
		$( SAVE_IMAGE_BTN ).attr( {'disabled' : turnOff }); 

	}
	// insta user button
	if(options == 'all' || options == 'user') {
		// bootstrap setting to toggle buttons 
	}
}

function toggleLoader(show, whichLoader) {
	if(show == true) show = 'inherit';
    else show = 'none';
    $( LOADER_PREFIX + whichLoader).css( { 'display' : show });
}


function resetDefaults() {
	// clear thumbnails vars
	$( THUMBNAIL_CONTAINER ).find( THUMBNAIL_CLASS ).remove(); 
	thumblist = [];
	thumbcount = 0;
	drawPixelatedToCanvas(ui.value, true, null);
}

/*********************************************
 * all the initial setup, mostly event handlers
 * and also, set intital slider value and grab
 * our pixelated canvas area for fiddling with
 *********************************************/
function setupEventHandlers() {
	canvdraw = document.getElementById( MAIN_CANVAS.substring(1) );
	getInstagramUserId();
	// start the pixelation process!
	$( GET_USER_BTN ).click( function(e) {
		toggleLoader( true, 'thumbs' );
		e.preventDefault();
		getInstagramUserId();
		return false;
	});

	$(window).resize( function() {
		changeCanvasSize(
			canvdraw, 
			document.body.clientWidth);
	});

	// save the current canvas data 
	$( SAVE_IMAGE_BTN ).click( function() {
		canvasImagePopup(canvdraw);
	});


	$("body").on('click', '.instathumb', function(e) {
        console.log("clicked " + e.target.id );
        var thumbclicked = e.target.id.substring(6);
        beginPixelationProcess(thumblist[thumbclicked].hi);
        $('#' + e.target.id).css({"border-color": "#85c222"});
    });

	// create a new window with a print-res size 
	$( HI_RES_BTNS ).click( function(e) {
		var imgRenderSize = e.target.id;
		imgRenderSize =  imgRenderSize.substring(16);
		console.log("preint res requested in size: " + e.target.id + " : " + imgRenderSize);
		if(imgRenderSize) {
			//toggleGUI( 'true', 'save' );
			toggleLoader( true, 'save' );
			setTimeout( function () { 
				var tmpHiResCanv = drawPixelatedToCanvas( getSliderValue(), false, imgRenderSize * 300);
				canvasImagePopup(tmpHiResCanv); 
				toggleLoader( false, 'save' );
			}, 25);
		}
	});

	// wipes the canvas and smaller image area, returning them to the instaPIXEL logo
	$( CLEAR_CANVAS_BTN ).click( function() {
		resetDefaults();
	});

	// determines when to update the image pixel processing
	$( SLIDER ).slider({ 
		orientation: "vertical", 
		min: 5,
		max: 50,
		change: function( event, ui ) {
			// ON SET SLIDER VALUE
			//updatePixelatedImage(ui.value);
		},
		slide: function( event, ui ) {
			// ON SLIDER MOVE
			drawPixelatedToCanvas(ui.value, true, null);
		}
	 });

	$( SLIDER ).slider( "option", "value", 10 );
	$( SLIDER ).height( 512 );	
}