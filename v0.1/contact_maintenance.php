<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : contact_maintenance.php
* Description   : manages contact DML 
* Author        : Scott Walkinshaw
* Date          : 24th July 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 24 Jul 11 | Initial issue                                     *
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
  *  Fetch contacts
  *  non admin user would potentially only see own contacts
  ****/
  $query  = "CALL p_contact_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action           = $_POST['action'];
  $contact_id       = $_POST['contact_id'];
  $email_address    = $_POST['email_address'];
  $email_permission = $_POST['email_permission'];

  /****
  *  Turn profile array into | separated string
  ****/
  $profile_field = '';
  foreach ($_POST['profile_field'] as $item) {
    $profile_field .= "|".$item;
  };

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$contact_id."',
            '".$email_address."',
            '".$email_permission."',
            '".$profile_field."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/contact_maintenance.txt", $query);

  /****
  *  Run query and return results into an associative array
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_contact_maintenance]:['.$db->errno.']:['.$db->error.']';
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
  echo $_REQUEST['response'].'({success:'.$status.
                               ',string:"'.$string.
                               '",error:"'.$error.
                               '",error_code:"'.$error_code.
                               '",new_id:"'.$new_id.
                               '",count:"'.$count.
                               '"})';

?>
