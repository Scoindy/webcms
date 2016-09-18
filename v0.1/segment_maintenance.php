<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : segment_maintenance.php
* Description   : manages segments in the database
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
  $query  = "CALL p_segment_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action       = $_POST['action'];
  $segment_id   = $_POST['filseg_id'];
  $segment_name = $_POST['filseg_name'];
  $description  = $_POST['description'];

  /****
  *  Turn arrays into | separated strings
  *  - what if someone searches for a |??
  ****/
  foreach ($_POST['profile_field'] as $item) {
    $profile_field .= "|".$item;
  }
  foreach ($_POST['operator'] as $item) {
    $operator .= "|".$item;
  }
  foreach ($_POST['value'] as $item) {
    $value .= "|".$item;
  }
  foreach ($_POST['and_or'] as $item) {
    $and_or .= "|".$item;
  }

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$segment_id."',
            '".$segment_name."',
            '".$description."',
            '".$and_or."',
            '".$profile_field."',
            '".$operator."',
            '".$value."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/segment.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_segment_maintenance]:['.$db->errno.']:['.$db->error.']';
  } else {
    $query = 'SELECT @status status, @string string, @error error, @error_code error_code, @new_id new_id, @count count';

    if (!($rs = $db->query($query))) {
     $error = 'PHP ERROR: ['.$query.']:['.$db->errno.']:['.$db->error.']';
    } else {
      $row = $rs->fetch_assoc();
      $status     = $row['status'];
      $string     = $row['string'];
      $error      = $row['error'];
      $error_code = $row['error_code'];
      $new_id     = $row['new_id'];
      $count      = $row['count'];
    }
  }

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  ****/
//  echo $_REQUEST['response'].'({success:'.$status.  ',string:"'.$string.  '",count:"'.$count.'"})';
  echo $_REQUEST['response'].'({success:'.$status.
                               ',string:"'.$string.
                               '",error:"'.$error.
                               '",error_code:"'.$error_code.
                               '",new_id:"'.$new_id.
                               '",count:"'.$count.
                               '"})';

?>
