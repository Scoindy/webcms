<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : email_test.php
* Description   : sends test email
* Author        : Scott Walkinshaw
* Date          : 6th January 2012
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 06 Jan 11 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once 'indigo_config.php';

  $email_subject  = $_POST['email_subject'];
  $email_from     = $_POST['email_from'];
  $email_body     = $_POST['email_body'];
  $test_address   = $_POST['test_address'];

  $header  = "From: $email_from\r\n";
  $header .= "Content-type: text/html\r\n"; 

  mail($test_address, $email_subject, $email_body, $header);

/*
  if (mail($test_address, $email_subject, $email_body)) {
   echo("<p>Message successfully sent!</p>");
  } else {
   echo("<p>Message delivery failed...</p>");
  }
*/
?>
