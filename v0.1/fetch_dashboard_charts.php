<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : fetch_dashboard_charts.php
* Description   : fetches data used in dashboard charts
* Author        : Scott Walkinshaw
* Date          : 4th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 04 Jan 12 | Initial issue                                     *
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
  *  Fetch chart data
  ****/
  $query  = "SELECT * FROM v_dashboard_charts ";

  $type   = $_POST['chart_type'];
  $query .=  "WHERE chart_type = '".$type."'";

  $start = is_numeric($_POST['start']) ? (integer)$_POST['start'] : 0;
  $limit = is_numeric($_POST['limit']) ? (integer)$_POST['limit'] : 20;

  /****
  *  Build rest of string
  ****/
  $query = $query . " LIMIT ".$start.", ".$limit;

  file_put_contents( "/tmp/dashboard_charts.txt", $query);


  /****
  *  Count the number of rows so we
  *  can display at bottom of grid
  ****/
  $count = mysql_query($query);
  $rows  = mysql_num_rows($count);

  /****
  *  Run query
  ****/
  $result = mysql_query($query);

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
