<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : email_view.php
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

  $ce_id      = $_POST['ce_id'];
  $contact_id = $_POST['contact_id'];

  /****
  *  Start building query
  ****/
  $query = "SELECT email_body FROM campaign_emails WHERE campaign_email_id = ".$ce_id." AND contact_id = ".$contact_id; 

  file_put_contents( "/tmp/email_view.txt", $query);

  /****
  *  Run query
  ****/
  if ($result = mysqli_query($db, $query)) {
//    printf("Select returned %d rows.\n", mysqli_num_rows($result));

    /****
    *  Check only 1 record is returned
    ****/
    if (mysqli_num_rows($result) != 1) {
      echo "error";
    }

    /****
    *  Populate variables from record
    ****/
    $row = mysqli_fetch_row($result);
    $html   = $row[0];

    /****
    *  Free result set
    ****/
    mysqli_free_result($result);
  }

  /****
  *  Write the html to a temporary
  *  file so it can be view
  ****/
  $tmpfile = tempnam("/indigo/views", "email_view.");
  $handle  = fopen($tmpfile, "w");
  fwrite($handle, $html);
  fclose($handle);

  $status = 1;
  $string = basename($tmpfile);

  echo $_REQUEST['response'].$string;

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  echo $_REQUEST['response'].'({success:'.$status.
                               ',string:"'.$string.
                               '",error:"'.$error.
                               '",error_code:"'.$error_code.
                               '",new_id:"'.$new_id.
                               '",count:"'.$count.
                               '"})';
  ****/

?>
