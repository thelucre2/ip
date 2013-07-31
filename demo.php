<?php
function alist ($array) {  //This function prints a text array as an html list.
  $alist = "<ul>";
  for ($i = 0; $i < sizeof($array); $i++) {
    $alist .= "<li>$array[$i]";
  }
  $alist .= "</ul>";
  return $alist;
}
/*exec("convert -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
echo "Version return code is $rcode <br>"; //Print the return code: 0 if OK, nonzero if error.
echo alist($out); //Print the output of "convert -version"*/
?>

<?php 
    $img = imagecreatefromjpeg('./test4.jpg'); 

    $imagew = imagesx($img);
    $imageh = imagesy($img);
    $xy = array();

    //echo "Image (w,h): ($imagew, $imageh)<br/>";

    $x = 0;
    $y = 0;
    $size = 5;
    for ($x = 0; $x < $imagew; $x++ ) {
    for ($y = 0;$y < $imageh; $y++ ) {
            $rgb = imagecolorat($img, $x, $y);
            $r = ($rgb >> 16) & 0xFF;
            $g = ($rgb >> 8) & 0xFF;
            $b = $rgb & 0xFF;

                //$xy[$x][$y] = array($r, $g, $b);
                $xy[$x][$y] = makeColorFromRGB( $r, $g, $b);

             /*if( $y % $size == 0 and $x % $size == 0) {
                echo "<div style=\"position:absolute; left:" . $x . "px; top:" . $y 
                . "px; width:" . $size ."px; height:" . $size ."px;"
                . "background: #" . $xy[$x][$y] . ";\"></div>\n";
              } */
        }
    }

   echo "<script>";
   $json = json_encode(($xy));
   echo "var colorMatrix = " . $json;
   echo "</script>";

   ?>

<?php 

  function makeColorFromRGB($r, $g, $b) {
    return str_pad(dechex($r), 2, '0', STR_PAD_LEFT) .
           str_pad(dechex($g), 2, '0', STR_PAD_LEFT) .
           str_pad(dechex($b), 2, '0', STR_PAD_LEFT); 
  }

?>