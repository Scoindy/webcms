<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : email_maintenance.php
* Description   : manages emails in the database
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
  $query = "CALL p_email_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action         = $_POST['action'];
  $email_id       = $_POST['email_id'];
  $email_name     = $_POST['email_name'];
  $email_subject  = $_POST['email_subject'];
  $sender_name    = $_POST['sender_name'];
  $sender_address = $_POST['sender_address'];
  $reply_to       = $_POST['reply_to'];
//  $email_body     = htmlentities($_POST['email_body']);
  $email_body     = mysql_real_escape_string($_POST['email_body']);
  $description    = $_POST['description'];
  $template_id    = $_POST['template_id'];
  $test_address   = $_POST['test_address'];

  /****
  *  Add parameters to query
  ****/
  $status = 0;
  $string = 'empty';
  $count  = -1;
  $query .= "'".$action."',
            '".$email_id."',
            '".$email_name."',
            '".$email_subject."',
            '".$email_body."',
            '".$sender_name."',
            '".$sender_address."',
            '".$reply_to."',
            '".$description."',
            '".$template_id."',
            '".$test_address."',
            @status,
            @string,
            @error,
            @error_code,
            @new_id,
            @count)";


  file_put_contents( "/tmp/email.txt", $query);

  /****
  *  Run query and return results into an associative array
  *
  *  If you get the out-of-sync error here it means
  *  you've left debug select statements in the stored proc
  ****/
  if (!($rs = $db->query($query))) {
    $error = 'PHP ERROR: [call to p_email_maintenance]:['.$db->errno.']:['.$db->error.']';
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
  *  Send a test email if required
  ****/
  file_put_contents( "/tmp/email2.txt", $action);
  if ($action == 'T') {
    $header  = "From: $sender_address\r\n";
    $header .= "Reply-to: $reply_to\r\n"; 
    $header .= "Content-type: text/html\r\n"; 
  file_put_contents( "/tmp/email4.txt", $header);
  file_put_contents( "/tmp/email5.txt", $string);

    mail($test_address, $email_subject, $string, $header);
/*
    if (!(mail($test_address, $email_subject, $string, $header))) {
      $error = 'PHP ERROR:[failed to send test email]';
  file_put_contents( "/tmp/email3.txt", $error);
  file_put_contents( "/tmp/email4.txt", $header);

    }
*/
  }

  /****
  *  Write the html to a temporary
  *  file so it can be view
  ****/
  $tmpfile = tempnam("/indigo/views", "email_view.");
  $handle = fopen($tmpfile, "w");
  fwrite($handle, $string);
  fclose($handle);

  $string = basename($tmpfile);

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
