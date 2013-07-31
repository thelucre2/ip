<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/jquery-ui.css">
        <link rel="stylesheet" href="css/main.css">       
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        
<div style="position:absolute; left:400px; top:0px;">
  
</div>  

<div id="wrapper">
  <div id="image-input" style="padding:20px;">
    image URL: <input class="image-source" type="text" style="width:80%;" 
        value="http://instagram.com/p/Z1bfkjCF1x/"/> 
    <input id="btn-get-image" type="button" value="GO"/> 
  </div>
  <div id="area-slider">
    <div id="slider"></div>
  </div>

  <div id="area-original">
    <img src="" />
  </div>
  
  <div id="area-pixelated">
    <canvas width="250" height="250"></canvas>
  </div>

  <div id="loader">
    <img src="img/loader.gif" />
  </div>
  <div>
    <a id="save" href="#">SAVE</a>
  </div>
  <div>
    <a id="scale" href="#">SCALE</a>
  </div>
</div>
<div id="console">
    X Math to render full width (deal wth pixel remainders)<br/>
    X Resize original image and accomodate for pixel version size<br/>
    _ Handle bad PHP returns (jQuery AJAX docs for success, fail, etc)<br/>
    _ List and consider all possible states of use<br/>
    _ Set Min and Max Sizes for images, PHP resize if out of bounds<br/>
    X Instagram API set up and test<br/>
    X Parse IDs from intagram URL<br/>
    _ Validate single post IDs<br/>
    _ Set up off screen canvas buffer to draw scaled images drawBuffer(pxWide, pxHigh)<br/>
    _ buttons to save off screen buffer as PNG<br/>
    _ design logo<br/>
    _ design home page<br/>
    _ google analytics<br/>
    _ refine keywords / description<br/>
    _ hide sensitive files<br/>
    _ redesign slider / form / buttons to pixel aesthetic<br/>
    _ make palette: http://www.codediesel.com/php/generating-color-palette-from-aimage/<br/>
    _ integrate instagram oAuth for users to select from their images<br/>
    _ 

    <!--
        no image loaded

        callback waiting

        bad instagram url
            bad ID
            not instagram domain
            null

        cannot connect to server (no internet)

        instgram returned no image (instagram down?)

        call back timed out


    -->
    <p>
        <?php
        
        ?>
    </p>
</div>



        <script src="js/vendor/jquery-1.9.1.min.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/vendor/jquery-ui.js"></script> 
        <script src="js/vendor/jcanvas.min.js"></script>
        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            /*var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script')); */
        </script>
    </body>
</html>
