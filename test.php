<?php

// if (!isset($_GET['url'])) die();			// use this later <----
if(isset($_GET['q'])) {
	$action = $_GET['q'];

	if($action == "getUserId" || 
	   $action == "getUserImages"	) {

		$url = urldecode($_POST['url']);
		getInstaJSON($url);
		return;

	} else {
		// A few settings
		$image = $_POST['src'];
		//$image = 'http://distilleryimage11.ak.instagram.com/bbd85522e1b011e2961e22000aa81fac_7.jpg';
		//$image = "test5.jpg";

		// Format the image SRC:  data:{mime};base64,{data};
		$src = getDataURI($image);
		$arr = array('src' => $src);
		// Echo out a sample image
		header('Content-type: text/html; charset=utf-8');
		echo json_encode($arr);
	}
} 

function getDataURI($image, $mime = '') {
	return 'data: '.(function_exists('mime_content_type') ? mime_content_type($image) : $mime).';base64,'.base64_encode(file_get_contents($image));
}

function getInstaJSON($url) {
	$url = 'https://' . str_replace('https://', '', $url); // Avoid accessing the file system
	echo file_get_contents($url);
}
?>
