$(document).ready( function() {

	$.ajax({ 
    	url: 'test.php',
	    data: {src: "test.jpg"},
        type: 'post'

	}).done(function (data) {
		try {
			var json = JSON.parse(data);
		    //console.log(json.src);
		    //console.log(data);
		    var img = new Image();
		    img.src = json.src;
		    //document.body.appendChild(img);

		    var canvas = document.createElement("canvas");
    		var ctx = canvas.getContext("2d");

    		img.onload = function() {
		    	canvas.width = img.width;
			    canvas.height = img.height;
			    ctx.drawImage( img, 0, 0 );
			    localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
			    document.body.appendChild(canvas);
			    var img2 = ctx.getImageData(0, 0, img.width, img.height);
			    console.log(img2);
			}

		} 
	catch(err) {
			console.log(err);
		}
		
	});

});	


function getImagePixelData(src) {
	/*
	var img = new Image,
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    src = "http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/picture_this/public/2013/06/05/sasha-cohen-instagram.jpg"; // insert image url here

	img.crossOrigin = "Anonymous";

	img.onload = function() {
	    canvas.width = img.width;
	    canvas.height = img.height;
	    ctx.drawImage( img, 0, 0 );
	    localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
	    document.body.appendChild(canvas);
	    var imgd = ctx.getImageData(0, 0, img.width, img.height);
	}
	img.src = src;
	// make sure the load event fires for cached images too
	if ( img.complete || img.complete === undefined ) {
	    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
	    img.src = src;
	}*/

	/* ORIGINAL 
	if( src === null || src == '') 
		return false;

	try {
		var i = new Image();
		//i.crossOrigin = 'http://profile.ak.fbcdn.net/crossdomain.xml';
		
		i.onload = function() {
			var w = this.width;
			var h = this.height;

			var c = document.createElement('canvas');
			var ctx = c.getContext('2d');
			
			c.width = w;
			c.height = h;

			ctx.drawImage(i, 0, 0);

			var strDataURI = c.toDataURL(); 
			this.src = strDataURI;

			var p = ctx.getImageData(0, 0, 1, 1).data; 
    		var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

			document.body.appendChild(c);
		};

		i.src = src;
	} 
	catch(err) {
		alert('problems:\n' + err.message);
	}*/
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

getImagePixelData('http://distilleryimage5.s3.amazonaws.com/7042f058cb4a11e2a89422000aa802aa_7.jpg');