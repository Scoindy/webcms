<?php // authenticate.php

/****
*  Ensure the file login.php is available
*  program execution will stop if it's not
****
require_once 'login.php';

 echo "x1";

$username='scott';
$password='scott';

  if (isset($_SERVER['PHP_AUTH_USER']) &&
      isset($_SERVER['PHP_AUTH_PW'])) {

    if ($_SERVER['PHP_AUTH_USER'] == $username &&
        $_SERVER['PHP_AUTH_PW']   == $password)
      echo "You are now logged in"; 
    else
      die("Authentication Failed");

//    echo "Username: " . $_SERVER['PHP_AUTH_USER'] . 
//         "Password: ' . $_SERVER['PHP_AUTH_PW'];
  } else {
    header('WWW-Authenticaticate: Basic realm="Restricted Section"');
    header('HTTP/1.0 401 Unauthorised');
    die("Please enter your username and password");
  }
  
?>

