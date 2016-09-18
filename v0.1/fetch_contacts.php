<?php
/*******************************************************************************
*                                                                              *
********************************************************************************
* Name          : fetch_contacts.php
* Description   : fetches data to populate contacts grid
* Author        : Scott Walkinshaw
* Date          : 2nd June 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 02 Jun 11 | Initial issue                                     *
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
  *  Are we returning filtered contacts?
  ****/
  $type      = $_POST['type'];
  $filseg_id = $_POST['filseg_id'];
  if ( $filseg_id > 0 ) {

    /****
    *  And are the filter or segment
    ****/
    if ( $type == 'F' ) {
      $query  = "SELECT * FROM filter_runs WHERE filter_run_id =  ".$filseg_id;
    } else {
      $query  = "SELECT * FROM segment_runs WHERE segment_run_id =  ".$filseg_id;
    }

    /****
    *  Is there a search field
    ****/
    if(isset($_POST['search']) && $_POST['search'] != '') {
      $search = sanitise($_POST['search']); // change to sanitize
      $filter = sanitise($_POST['filter']);
      $query .=  " AND ".$filter." LIKE '%".$search."%' ";
    }

  } else {

    $query  = "SELECT * FROM v_contacts ";

    /****
    *  Is there a filter?
    ****/
    if(isset($_POST['search']) && $_POST['search'] != '') {
      $search = sanitise($_POST['search']); // change to sanitize
      $filter = sanitise($_POST['filter']);
      $query .=  "WHERE ".$filter." LIKE '%".$search."%' ";
  }
  }

  $start = is_numeric($_POST['start']) ? (integer)$_POST['start'] : 0;
  $limit = is_numeric($_POST['limit']) ? (integer)$_POST['limit'] : 20;

  /****
  *  Build rest of string
  ****/
  $sql = $query . " LIMIT ".$start.", ".$limit;

  file_put_contents("/tmp/fetch_contacts.txt", $query);

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

  /****
  *  Function:    sanitise
  *  Description: cleans string to prevent SQL injection
  ****/
  function sanitise($string) {

    /****
    *  htmlentities strips out HTML markup 
    *  to prevent SQL and XSS injection
    ****/
    return htmlentities(mysql_fix_string($string));
  }
  
  /****
  *  Function:    mysql_fix_string
  *  Description: strip slashses from input string if magic quotes is turned on
  ****/
  function mysql_fix_string($string) {
  
    if (get_magic_quotes_gpc())
      $string = stripslashes($string);

    return mysql_real_escape_string($string);
  }
?>
