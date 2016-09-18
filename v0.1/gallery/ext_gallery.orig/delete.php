<?php

$dir = 'img/ori/';
$dir_thumbs = 'img/thumbs/';

$arrayImg = explode(";", $_POST['images']);

foreach($arrayImg as $imgname) {
    if ($imgname != "") {
        unlink($dir.$imgname);
        unlink($dir_thumbs.'thumb_'.$imgname);
    }
}

echo '{success: true}';
