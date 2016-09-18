<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : live_send.php
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
  $query  = "CALL p_live_send (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action           = $_POST['action'];
  $campaign_id      = $_POST['campaign_id'];
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
            '".$segment_id."',
            '".$email_id."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/live_send.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_live_send]:['.$db->errno.']:['.$db->error.']';
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


  /****
  *  Now call db again to newly created emails
  ****/
  $query = "SELECT * FROM v_send_emails WHERE campaign_email_id = " . $new_id;
  file_put_contents( "/tmp/live_send.txt2", $query);

  /****
  *  Prepare statement
  ****/
  if($stmt = $db->prepare($query)) {
  
    /****
    *  Execute statement
    ****/
    $stmt->execute();

    /****
    *  Bind results to variables
    ****/
    $stmt->bind_result($id, $contact_id, $email_address, $email_subject, $email_body, $sender_name, $sender_address, $reply_to);

    /****
    *  Loop through result set
    ****/
    while ($stmt->fetch()) {

      /****
      *  Prepare header
      ****/
      $header  = "From: $sender_address\r\n";
      $header .= "Reply-to: $reply_to\r\n";
      $header .= "Content-type: text/html\r\n";
      file_put_contents("/tmp/live_send.txt3", $email_body);

      /****
      *  Send email
      ****/
      if (!(mail($email_address, $email_subject, $email_body, $header))) {
        $error = 'PHP ERROR:[failed to send test email]';
      } else {

        /****
        *  Record that the email has been sent
        ****/
        $sdt = date("Y-m-d H:i:s");
        $query = "UPDATE campaign_emails SET sent = TRUE, sent_datetime = '" .$sdt."' WHERE campaign_email_id = " . $id . " AND contact_id = " . $contact_id;
        file_put_contents( "/tmp/live_send.txt4", $query);

        $db2 = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);
        if (!($rs = $db2->query($query))) {
        file_put_contents( "/tmp/live_send.txt5", 'update_failed');
          $error = 'PHP ERROR: [could not update sent status of contact_id [' . $contact_id;
        };
      };
    }
  }

  /****
  *  Close database connection
  ****/
  $db->close(); 

?>
