<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : filter_maintenance.php
* Description   : manages filter DML 
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
  $db_server = mysql_connect($db_hostname, $db_username, $db_password);
  if (!$db_server) die("Unable to connect to database: " . mysql_error());
  mysql_select_db($db_database) or die("Unable to select database: " .mysql_error());

  /****
  *  Fetch contacts
  *  non admin user would potentially only see own contacts
  ****/
  $query  = "SELECT f_filter_maintenance (";

  /****
  *  Sanitise all free text fields
  *  and build procedure call
  ****/
  $action        = $_POST['action'];
  $filter_id     = $_POST['filter_id'];
  $filter_name   = $_POST['filter_name'];
  $descripton    = $_POST['description'];

  /****
  *  Turn arrays into | separated strings
  *  - what if someone searches for a |??
  ****/
  foreach ($_POST['profile_field'] as $item) {
    $profile_field .= "|".$item;
  }
  foreach ($_POST['operator'] as $item) {
    $operator .= "|".$item;
  }
  foreach ($_POST['value'] as $item) {
    $value .= "|".$item;
  }
  foreach ($_POST['and_or'] as $item) {
    $and_or .= "|".$item;
  }

  /****
  *  Add parameters to query
  ****/
  $query .= "'".$action."','".$filter_id."','".$filter_name."','".$description."','".$and_or."','".$profile_field."','".$operator."','".$value."')";

  file_put_contents( "/tmp/filter.txt", "set @ret = ".$query.";" );

  /****
  *  Run query
  ****/
  $result = mysql_query($query);

  /****
  *  If we're counting then the function will return a query
  ****/
  if ( $action == 'C' ) {

    $query  = mysql_fetch_array($result);
    $result  = mysql_query($query[0]);
    $status[0] = '1';
    $count = mysql_fetch_array($result);

    file_put_contents( "/tmp/filter.txt", $count[1]);
  } else {
    $status = mysql_fetch_array($result);
  }

  /****
  *  Package into a JSON string and
  *  call the AJAX function callback with
  *  number of rows and string
  ****/
//  file_put_contents( "/tmp/filter.txt", $status);
//  echo $_REQUEST['response']. '({success:'.$status[0].',string:'".$count.'"'})'
//  echo $_REQUEST['response']. '({success:'.$status[0].',string:"hello"})';
//  echo $_REQUEST['response'].'({success:'.$status[0].',string:"hello"})';
    echo $_REQUEST['response'].'({success:'.$status[0].',string:"'.$count[0].'"})';


//({success:1,string:"hello"}

//echo json_encode($string);

//echo " {\"success\": true,\"message\": \"hello\"}";

?>
