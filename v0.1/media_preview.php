<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : media_preview.php
* Description   : uploads file to server and returns details
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Jan 12 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once 'indigo_config.php';
//  require_once 'indigo_library.php';

  /****
  *  Initialise
  ****/
  $width  = 0;
  $height = 0;
  $url    = 'empty';

  /****
  *  Do we have a file?
  ****/
  if (isset($_FILES)) {

    /****
    *  Get temp filename
    ****/
    $temp = $_FILES['filename']['tmp_name'];

    /****
    *  Check we've got something
    ****/
    if (empty($temp)) {
      $status = 0;
    } else {
      $filename = $_FILES['filename']['name'];
      $url      = 'preview/'.$filename;

      /****
      *  Move the file to preview
      ****/
      if (move_uploaded_file($temp, $url)) {

        /****
        *  Get width and height
        ****/
        $source = imagecreatefromjpeg($url);
        $width  = imagesx($source);
        $height = imagesy($source);
        $status = '1';
      }
    }
  } else {
    $status = 0;
  };

  file_put_contents( "/tmp/media_preview.txt", $status);
  file_put_contents( "/tmp/media_preview2.txt", $url);

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  *
  *  ExtJS : success - true (1) for valid
  ****/
  $resp = '({success:'.$status.
           ',width:"'.$width.
          '",height:"'.$height.
          '",url:"'.$url.
          '"})';

  file_put_contents( "/tmp/media_preview3.txt", $resp);

  echo $_REQUEST['response'].'({success:'.$status.
                               ',width:"'.$width.
                               '",height:"'.$height.
                               '",url:"'.$url.
                               '",filename:"'.$filename.
                               '"})';
?>
