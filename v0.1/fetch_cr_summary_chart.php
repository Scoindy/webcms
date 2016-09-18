<?php
/*******************************************************************************
* Indio
********************************************************************************
* Name          : fetch_cr_summary_chart.php
* Description   : fetches data to populate emails grid
* Author        : Scott Walkinshaw
* Date          : 5th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 05 Jan 12 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once 'indigo_config.php';

  /****
  *  Connect to DB
  ****/
  $db_server = mysql_connect($db_hostname, $db_username, $db_password);
  if (!$db_server) die("Unable to connect to database: " . mysql_error());
  mysql_select_db($db_database) or die("Unable to select database: " .mysql_error());

  /****
  *  Fetch emails
  *  non admin user would potentially only see own contacts
  ****/
  $query  = "SELECT * FROM v_cr_summary_chart ";

  /****
  *  Is there an email_id?  There should always be
  ****/
  if(isset($_POST['ce_id'])) {
    $ce_id  = $_POST['ce_id']; // change to sanitize
    $query .=  " WHERE campaign_email_id = '".$ce_id."'";
  }

  $start = is_numeric($_POST['start']) ? (integer)$_POST['start'] : 0;
  $limit = is_numeric($_POST['limit']) ? (integer)$_POST['limit'] : 20;

  file_put_contents( "/tmp/cr_summary_chart.txt", $query);

  /****
  *  Build rest of string
  ****/
  $sql = $query . " LIMIT ".$start.", ".$limit;

  /****
  *  Count the number of rows so we
  *  can display at bottom of grid
  ****/
  $count = mysql_query($query);
  $rows  = mysql_num_rows($count);

  /****
  *  Run query
  ****/
  $result = mysql_query($sql);

  if (!$result) {
    die("Database access failure: " . mysql_error()); // want to return this at some point
  } else {

    /****
    *  Populate array from results
    ****/
    while($obj = mysql_fetch_object($result)) {
      $array[] = $obj;
    }
  }  

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  ****/
  echo $_REQUEST['response'].'({total:'.$rows.',results:'.json_encode($array).'})'; 

?>