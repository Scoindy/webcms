
  /****
  *  Function:    sanitize
  *  Description: cleans string to prevent SQL injection
  ****/
  function sanitize($string) {

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
