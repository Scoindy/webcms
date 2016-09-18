<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : media_maintenance.php
* Description   : manages medias in the database
* Author        : Scott Walkinshaw
* Date          : 24th November 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 24 Dec 11 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once 'indigo_config.php';
//  require_once 'indigo_library.php';

  /****
  *  Connect to DB
  ****/
  $db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);
  if (!$db) {
    die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
  }

  /****
  *  Start building query
  ****/
  $query = "CALL p_media_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action         = $_POST['action'];
  $media_id       = $_POST['media_id'];
  $media_name     = $_POST['media_name'];
  $description    = $_POST['description'];
  $media_type_id  = $_POST['media_type'];


  /****
  *  isset($_FILES) doesn't seem to be working
  *  so wrap an action test round the whole thing
  *****/
  if ( $action == 'I' ) {

    /****
    *  Do we have a file?
    ****/
    if (isset($_FILES)) {

      /****
      *  Get temp and original filenames
      ****/
      $temp = $_FILES['filename']['tmp_name'];
      $orig = $_FILES['filename']['name'];
      file_put_contents( "/tmp/la.txt", $temp);

      /****
      *  Get file extension
      ****/
      $ext = explode ('.', $orig);
      $ext = $ext[count($ext) - 1];

      /****
      *  Remove extension from
      *  the original filename
      ****/
      $filename = str_replace($ext, '', $orig);

      $url           = 'images/'.$filename.$ext;
      $thumbnail_url = 'images/'.$filename."tb.".$ext;
  
      /****
      *  Have we uploaded the file?
      ****/
      if (move_uploaded_file ($temp, $url)) {

        /****
        *  Make a thumbnail
        ****/
        $source = imagecreatefromjpeg($url);
        $width  = imagesx($source);
        $height = imagesy($source);

        /****
        *  Desired height and width
        ****/
        $desired_width  = 100;
        $desired_height = 100; //floor($height*($desired_width/$width)); // = 40;
  
        /****
        *  Create new virtual image
        ****/ 
        $virtual = imagecreatetruecolor($desired_width,$desired_height);
  
        /****
        *  Copy source image to new size
        ****/
        imagecopyresized($virtual,$source,0,0,0,0,$desired_width,$desired_height,$width,$height);
  
        /****
        *  Save the thumbnail
        ****/
        imagejpeg($virtual, $thumbnail_url, 100);

      };

      $mime_type     = $_FILES['filename']['type'];
      $size          = $_FILES['filename']['size'];
      $filename      = basename($url);

    } else {

      $url           = '';
      $thumbnail_url = '';
      $filename      = '';
      $mime_type     = '';
      $size          = '';
      $width         = '';
      $height        = '';
       
    };
  };

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$media_id."',
            '".$media_name."',
            '".$description."',
            '".$media_type_id."',
            '".$url."',
            '".$thumbnail_url."',
            '".$filename."',
            '".$mime_type."',
            '".$size."',
            '".$width."',
            '".$height."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/media_maintenance.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_media_maintenance]:['.$db->errno.']:['.$db->error.']';
  } else {
    $query = 'SELECT @status status, @string string, @error error, @error_code error_code, @new_id new_id, @count count';

    if (!($rs = $db->query($query))) {
      $error = 'PHP ERROR: ['.$query.']:['.$db->errno.']:['.$db->error.']';
    } else {
      $row        = $rs->fetch_assoc();
      $status     = $row['status'];
      $string     = $row['string'];
      $error      = $row['error'];
      $error_code = $row['error_code'];
      $new_id     = $row['new_id'];
      $count      = $row['count'];
    }
  }

  /****
  *  Escape the HTML back from the database if viewing
  *  as it's going into JSON string 
  ****/
  $string = mysql_real_escape_string($string);

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  ****/
  $resp = '({success:'.$status.
                               ',string:"'.$string.
                               '",error:"'.$error.
                               '",error_code:"'.$error_code.
                               '",new_id:"'.$new_id.
                               '",count:"'.$count.
                               '"})';

  file_put_contents( "/tmp/media_maintenance2.txt", $resp);

  echo $_REQUEST['response'].'({success:'.$status.
                               ',string:"'.$string.
                               '",error:"'.$error.
                               '",error_code:"'.$error_code.
                               '",new_id:"'.$new_id.
                               '",count:"'.$count.
                               '"})';

?>
