<?php

$localMode = true;

require 'instagram.class.php';

// RETURN CODE CONSTANTS
define("STATUS_SUCCESS",    "0");
define("STATUS_FAIL",       "1");
define("STATUS_BAD_LINK",   "2");

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch($action) {
        case 'getImage' : getImage($_POST['src']);break;
        case 'blah' : blah();break;
        // ...etc...
    }
}

function getImage($imgsrc) {

    try  
    {  
        if(false) {

            $src = './test4.jpg';

        } else { 
            // Setup class
            $instagram = new Instagram(array(
            'apiKey'      => '94070540ddb543e793c98677dbf410c7',
            'apiSecret'   => '96e0b3c5f40c430e98436697da6acd10',
            'apiCallback' => 'index.php' // must point to success.php
            ));

            $media = json_decode($instagram->getOEmbed($imgsrc), true);

            if(! $media ) {

                $details = ['status' => 'failure',
                            'msg'    => '$media is not defined: ' . $media,
                            'stack'  => var_dump($imgsrc) ];
                $json = json_encode($details);
                echo $json;   
                return;

            }

            $instaID = $media['media_id'];
            $callback = $instagram->getMedia($instaID);
            $callback['data']['images']['standard_resolution']['url'];

            
            $src = $callback['data']['images']['standard_resolution']['url'];

            if(! $src ) {

                $details = ['status' => 'failure',
                            'msg'    => '$src is not defined: ' . $src,
                            'stack'  => var_dump($media) ];
                $json = json_encode($details);
                echo $json;   
                return;

            }
        }

        $img = imagecreatefromjpeg($src); 

        if(! $img ) {

            $details = ['status' => 'failure',
                        'msg'    => '$img is not defined: ' . $img,
                        'stack'  => var_dump($media)];
            $json = json_encode($details);
            echo $json;   
            return;

        }

        $imagew = imagesx($img);
        $imageh = imagesy($img);

        $xy = array();

        $x = 0;
        $y = 0;
        $size = 5;
        for ($x = 0; $x < $imagew; $x++ ) {
            $temp = array();
            for ($y = 0;$y < $imageh; $y++ ) {
                $rgb = imagecolorat($img, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;
                $temp[] = makeColorFromRGB( $r, $g, $b);
            }
            $xy[] = $temp;
        }
       $details = ['src' => $src, 'colors' => $xy, 'status' => 'success'];
       $json = json_encode($details);
       echo $json;  
    }  
    catch (Exception $e)  
    { 
        $details = ['status' => 'failure'];
        $json = json_encode($details);
        echo $json;   
    }  
}

function makeColorFromRGB($r, $g, $b) {
    return str_pad(dechex($r), 2, '0', STR_PAD_LEFT) .
       str_pad(dechex($g), 2, '0', STR_PAD_LEFT) .
       str_pad(dechex($b), 2, '0', STR_PAD_LEFT); 
}


function varDumpToString ($var)
{
    ob_start();
    var_dump($var);
    $result = ob_get_clean();
    return $result;
}

?>