<?php
$dir = "img/ori/";
$dir_thumbs = "img/thumbs/";

$images = array();
$d = dir($dir);
while($name = $d->read()){
    if(!preg_match('/\.(jpg|gif|png)$/', $name)) continue;
    $size = filesize($dir.$name);
    $lastmod = filemtime($dir.$name)*1000;
    $thumb = "thumb_".$name;
    $images[] = array('name' => $name, 'size' => $size,
			'lastmod' => $lastmod, 'url' => $dir.$name,
            'thumb_url' => $dir_thumbs.$thumb);
}
$d->close();
$o = array('images'=>$images);
echo json_encode($o);
