#!/usr/bin/php
<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : load_templates.php
* Description   : loads template HTML into the dtabase
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Jan 12 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once '../indigo_config.php';
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
  $query  = "CALL p_template_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action = 'I';

  $file = $argv[1];

  /****
  *  Use filename minus extenstion as template name
  ****/
  $template_name = implode('.', explode('.', $file, -1));

  $html = mysql_real_escape_string(file_get_contents($file, true));

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$template_name."',
            '".$html."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/load_template.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_load_templates]:['.$db->errno.']:['.$db->error.']';
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

?>
