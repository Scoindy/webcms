<?php
/*******************************************************************************
*                                                                              *
********************************************************************************
* Name          : fetch_substitution_fields.php
* Description   : fetches data to populate substitution combo
* Author        : Scott Walkinshaw
* Date          : 7th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Jan 12 | Initial issue                                     *
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
  *  Fetch contacts
  *  non admin user would potentially only see own contacts
  ****/
  $query  = "SELECT * FROM v_substitution_fields ";

  $start = is_numeric($_POST['start']) ? (integer)$_POST['start'] : 0;
  $limit = is_numeric($_POST['limit']) ? (integer)$_POST['limit'] : 20;

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
