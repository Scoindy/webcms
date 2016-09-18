<?php
/*******************************************************************************
* Indigo
********************************************************************************
* Name          : unsubscribe.php
* Description   : manages unsubscribes
* Author        : Scott Walkinshaw
* Date          : 24th July 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 24 Jul 11 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Includes
  ****/
  require_once '../indigo_config.php';
//  require_once 'indigo_library.php';

  /****
  *  Check if the the form has been submitted
  *  if not then display the form
  ****/
  if (!isset($_POST['button'])) {

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Unsubscribe</title>
    <link href="css/all.css" rel="stylesheet" type="text/css" />
  </head>
  <body id="inscription">
    <div class="compart">
      <h1>Unsubscribe</h1>
      <div>
        <h6>Do you really want to unsubscribe?</h6><br />
        <table border="0" cellpading="0" cellspacing="0">
          <tr>
            <td>
              <form action="<?php echo htmlentities($_SERVER['PHP_SELF']);?>" method="post">
                <input type="hidden" name="u" value="<?php echo htmlentities($_GET['u']);?>" />
                <input type="hidden" name="button" value="unsubscribe" />
                <input type="submit" value="Unsubscribe" />
              </form>
            </td>
            <td>
              <form action="unsubscribe.php" method="post">
                <input type="hidden" name="button" value="cancel" />
                <input type="submit" value="Cancel" />
              </form>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
<?php
  } else {

    /****
    *  Which button was pressed?
    ****/
    $button = $_POST['button'];

    if ( $button == 'unsubscribe' ) {

      /****
      *  Connect to DB
      ****/
      $db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);
      if (!$db) {
        die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
      }

      /****
      *  Security - check that the UUID has been passed
      ****/
      if (isset($_POST['u']) && $_POST['u'] != '') {
        $u = $_POST['u'];

        /****
        *  Unsubscribe query
        ****/
        $query  = "CALL p_subscription_maintenance (";

        /****
        *  Add parameters to query
        ****/
        $status = 0;
        $string = 'empty';
        $count  = -1;
        $query .= "'".$u."',
                  @status,
                  @string,
                  @error,
                  @error_code,
                  @new_id,
                  @count)";

        file_put_contents( "/tmp/unsubscribe.txt", $query);

        /****
        *  Run query and return results into an associative array
        ****/
        if (!($rs = $db->query($query))) {
          $error = 'PHP ERROR: [call to p_unsubscribe]:['.$db->errno.']:['.$db->error.']';
        } else {
          $query = 'SELECT @status status, @string string, @error error, @error_code error_code, @new_id new_id, @count count';

          if (!($rs = $db->query($query))) {
           $error = 'PHP ERROR: ['.$query.']:['.$db->errno.']:['.$db->error.']';
          } else {
            $row = $rs->fetch_assoc();
            $status     = $row['status'];
            $string     = $row['string'];
            $error      = $row['error'];
            $error_code = $row['error_code'];
            $new_id     = $row['new_id'];
            $count      = $row['count'];
          }
        }

        echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                  <title>Unsubscribe</title>
                  <link href="css/all.css" rel="stylesheet" type="text/css" />
                </head>
                <body id="inscription">
                  <div class="compart">
                    <h1>Unsubscribe</h1>
                    <div>
                      <h6>You have successfully unsubscribed</h6>
                    </div>
                  </div>
                </body>
              </html>';

      } else {

        /****
        *  Display error page
        ****/
        echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                  <title>Unsubscribe</title>
                  <link href="css/all.css" rel="stylesheet" type="text/css" />
                </head>
                <body id="inscription">
                  <div class="compart">
                    <h1>Warning</h1>
                    <div>
                      <h6>You have clicked an invalid unsubscribe link</h6>
                    </div>
                  </div>
                </body>
              </html>';
      }

    } else {

      /****
      *  Display cancel page
      ****/
      echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>Unsubscribe</title>
                <link href="css/all.css" rel="stylesheet" type="text/css" />
              </head>
              <body id="inscription">
                <div class="compart">
                  <h1>Unsubscribe</h1>
                  <div>
                    <h6>Unsubscribe cancelled!</h6>
                  </div>
                </div>
              </body>
            </html>';
    };
  }
?> 
