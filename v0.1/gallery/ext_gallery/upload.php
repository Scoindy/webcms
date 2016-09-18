<?php

// in ie should add image/pjpeg

function createThumb($img_file, $ori_path, $thumb_path, $img_type) {

    // get the image source
    $path = $ori_path;
    $img = $path.$img_file;
    switch ($img_type) {
        case "image/jpeg":
            $img_src = @imagecreatefromjpeg($img);
            break;
        case "image/pjpeg":
            $img_src = @imagecreatefromjpeg($img);
            break;
        case "image/png":
            $img_src = @imagecreatefrompng($img);
            break;
        case "image/x-png":
            $img_src = @imagecreatefrompng($img);
            break;
        case "image/gif":
            $img_src = @imagecreatefromgif($img);
            break;
    }
    $img_width = imagesx($img_src);
    $img_height = imagesy($img_src);

    $square_size = 100;

    // check width, height, or square
    if ($img_width == $img_height) {
        // square
        $tmp_width = $square_size;
        $tmp_height = $square_size;
    } else if ($img_height < $img_width) {
        // wide
        $tmp_height = $square_size;
        $tmp_width = intval(($img_width / $img_height) * $square_size);
        if ($tmp_width % 2 != 0) {
            $tmp_width++;
        }
    } else if ($img_height > $img_width) {
        $tmp_width = $square_size;
        $tmp_height = intval(($img_height / $img_width) * $square_size);
        if ($tmp_height % 2 != 0) {
            $tmp_height++;
        }
    }

    $img_new = imagecreatetruecolor($tmp_width, $tmp_height);
    imagecopyresampled($img_new, $img_src, 0, 0, 0, 0,
            $tmp_width, $tmp_height, $img_width, $img_height);

    // create temporary thumbnail and locate on the server
    $thumb = $thumb_path."thumb_".$img_file;
    switch ($img_type) {
        case "image/jpeg":
            imagejpeg($img_new, $thumb);
            break;
        case "image/pjpeg":
            imagejpeg($img_new, $thumb);
            break;
        case "image/png":
            imagepng($img_new, $thumb);
            break;
        case "image/x-png":
            imagepng($img_new, $thumb);
            break;
        case "image/gif":
            imagegif($img_new, $thumb);
            break;
    }

    // get tmp_image
    switch ($img_type) {
        case "image/jpeg":
            $img_thumb_square = imagecreatefromjpeg($thumb);
            break;
        case "image/pjpeg":
            $img_thumb_square = imagecreatefromjpeg($thumb);
            break;
        case "image/png":
            $img_thumb_square = imagecreatefrompng($thumb);
            break;
        case "image/x-png":
            $img_thumb_square = imagecreatefrompng($thumb);
            break;
        case "image/gif":
            $img_thumb_square = imagecreatefromgif($thumb);
            break;
    }

    $thumb_width = imagesx($img_thumb_square);
    $thumb_height = imagesy($img_thumb_square);

    if ($thumb_height < $thumb_width) {
        // wide
        $x_src = ($thumb_width - $square_size) / 2;
        $y_src = 0;
        $img_final = imagecreatetruecolor($square_size, $square_size);
        imagecopy($img_final, $img_thumb_square, 0, 0,
                $x_src, $y_src, $square_size, $square_size);
    } else if ($thumb_height > $thumb_width) {
        // landscape
        $x_src = 0;
        $y_src = ($thumb_height - $square_size) / 2;
        $img_final = imagecreatetruecolor($square_size, $square_size);
        imagecopy($img_final, $img_thumb_square, 0, 0,
                $x_src, $y_src, $square_size, $square_size);
    } else {
        $img_final = imagecreatetruecolor($square_size, $square_size);
        imagecopy($img_final, $img_thumb_square, 0, 0,
                0, 0, $square_size, $square_size);
    }

    switch ($img_type) {
        case "image/jpeg":
            @imagejpeg($img_final, $thumb);
            break;
        case "image/pjpeg":
            @imagejpeg($img_final, $thumb);
            break;
        case "image/png":
            @imagepng($img_final, $thumb);
            break;
        case "image/x-png":
            @imagepng($img_final, $thumb);
            break;
        case "image/gif":
            @imagegif($img_final, $thumb);
            break;
    }
}

$ori_dir = 'img/ori/';
$thumb_dir = 'img/thumbs/';

$allowedType = array(
    'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/x-png'
);

$uploaded = 0;
$failed = 0;

foreach($_FILES['img']['name'] as $key => $img) {
    if (in_array($_FILES['img']['type'][$key], $allowedType)) {
        // max upload file is 500 KB
        if ($_FILES['img']['size'][$key] <= 500000) {
            // upload file
            move_uploaded_file($_FILES['img']['tmp_name'][$key],
                    $ori_dir.$_FILES['img']['name'][$key]);

            // create thumbnail
            createThumb($_FILES['img']['name'][$key],
                $ori_dir, $thumb_dir,
                $_FILES['img']['type'][$key]);

            // count how many files uploaded
            $uploaded++;
        } else {
            $failed++;
        }
    } else if ($_FILES['img']['type'][$key] != '') {
        $failed++;
    }
}

echo '{success: true, failed: '.$failed.', uploaded: '.$uploaded.', type: "'.$_FILES['img']['type'][0].'"}';

?>