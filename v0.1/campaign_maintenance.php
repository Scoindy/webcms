<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : campaign_maintenance.php
* Description   : manages campaigns in the database
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
  $query  = "CALL p_campaign_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action           = $_POST['action'];
  $campaign_id      = $_POST['campaign_id'];
  $campaign_name    = $_POST['campaign_name'];
  $description      = $_POST['description'];
  $campaign_type_id = $_POST['campaign_type_id'];
  $start_date       = $_POST['start_date'];
  $end_date         = $_POST['end_date'];
  $email_id         = $_POST['email_id'];

  /****
  *  Turn arrays of campaign segment ids into | separated strings
  ****/
  foreach ($_POST['segment_id'] as $item) {
    $segment_id .= "|".$item;
  }

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$campaign_id."',
            '".$campaign_name."',
            '".$description."',
            '".$campaign_type_id."',
            '".$start_date."',
            '".$end_date."',
            '".$segment_id."',
            '".$email_id."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/campaign.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_campaign_maintenance]:['.$db->errno.']:['.$db->error.']';
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
