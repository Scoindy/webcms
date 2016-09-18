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
  if (!isset($_POST['submit'])) {

    /****
    *  Get the contact details from the database
    ****/
    $u = $_GET['u'];
    $query  = "SELECT * from v_form_update_details WHERE uuid = '";
    $query .= $u."'";
    file_put_contents( "/tmp/update_details2.txt", $query);

    /****
    *  Connect to DB
    ****/
    $db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);
    if (!$db) {
      die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
    }

    /****
    *  Run query
    ****/
    if ($result = mysqli_query($db, $query)) {
//      printf("Select returned %d rows.\n", mysqli_num_rows($result));

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

      $first_name   = $row[1];
      $last_name    = $row[2];
      $address_1    = $row[3];
      $address_2    = $row[4];
      $address_3    = $row[5];
      $address_4    = $row[6];
      $postcode     = $row[7];
      $phone_work   = $row[8];
      $phone_mobile = $row[9];

      /****
      *  Free result set
      ****/
      mysqli_free_result($result);
    }

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<meta name="HandheldFriendly" content="true" />
<title>Form</title>
<link type="text/css" rel="stylesheet" href="css/styles/form.css?v3.0.2332"/>
<link href="css/calendarview.css?v3.0.2332" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="css/styles/pastel.css" />
<style type="text/css">
    .form-label{
        width:150px !important;
    }
    .form-label-left{
        width:150px !important;
    }
    .form-line{
        padding:10px;
    }
    .form-label-right{
        width:150px !important;
    }
    .form-all{
        width:650px;
        background: repeat scroll 0% 0% rgb(207, 204, 200);
        color:rgb(82, 75, 58) !important;
        font-family:Tahoma;
        font-size:13px;
    }
</style>

</head>
<body>
<form class="jotform-form" action="<?php echo htmlentities($_SERVER['PHP_SELF']);?>" method="post" name="update_details" id="update_details" accept-charset="utf-8">
  <input type="hidden" name="u" value="<?php echo htmlentities($_GET['u']);?>" />
  <div class="form-all">
    <ul class="form-section">
      <li class="form-line" id="id_4">
        <div id="cid_4" class="form-input-wide">
          <div style="text-align:center;">
            <img alt="" class="form-image" border="0" src="http://indigo.com/images/datamine_logo.jpg" height="69" width="550" />
          </div>
        </div>
      </li>
      <li class="form-line" id="id_9">
        <div id="cid_9" class="form-input-wide">
          <div id="text_9" class="form-html">
            <p>
              <strong>
                Please update your details:
              </strong>
            </p>
          </div>
        </div>
      </li>
      <li class="form-line" id="id_1">
        <label class="form-label-left" id="label_1" for="input_1"> Full Name </label>
        <div id="cid_1" class="form-input"><span class="form-sub-label-container"><input class="form-textbox" type="text" size="10" name="first_name" id="first_1" value="<?php echo $first_name;?>" />
            <label class="form-sub-label" for="first_1" id="sublabel_first"> First Name </label></span><span class="form-sub-label-container"><input class="form-textbox" type="text" size="15" name="last_name" id="last_1" value="<?php echo $last_name;?>" />
            <label class="form-sub-label" for="last_1" id="sublabel_last"> Last Name </label></span>
        </div>
      </li>
      <li class="form-line" id="id_6">
        <label class="form-label-left" id="label_6" for="input_6"> Address </label>
        <div id="cid_6" class="form-input">
          <table summary="" class="form-address-table" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td colspan="2"><span class="form-sub-label-container"><input class="form-textbox form-address-line" type="text" name="address_1" id="input_6_addr_line1" value="<?php echo $address_1;?>" />
                  <label class="form-sub-label" for="input_6_addr_line1" id="sublabel_addr_line1"> Street Address </label></span>
              </td>
            </tr>
            <tr>
              <td colspan="2"><span class="form-sub-label-container"><input class="form-textbox form-address-line" type="text" name="address_2" id="input_6_addr_line2" size="46"  value="<?php echo $address_2;?>" />
                  <label class="form-sub-label" for="input_6_addr_line2" id="sublabel_addr_line2"> Street Address Line 2 </label></span>
              </td>
            </tr>
            <tr>
              <td width="50%"><span class="form-sub-label-container"><input class="form-textbox form-address-city" type="text" name="address_3" id="input_6_town" size="21" value="<?php echo $address_3;?>" />
                  <label class="form-sub-label" for="input_6_town" id="sublabel_town"> Town </label></span>
              </td>
              <td><span class="form-sub-label-container"><input class="form-textbox form-address-city" type="text" name="address_4" id="input_6_city" size="22" value="<?php echo $address_4;?>"/>
                  <label class="form-sub-label" for="input_6_city" id="sublabel_city"> City </label></span>
              </td>
            </tr>
            <tr>
              <td width="50%"><span class="form-sub-label-container"><input class="form-textbox form-address-postal" type="text" name="postcode" id="input_6_postal" size="10" value="<?php echo $postcode;?>"/>
                  <label class="form-sub-label" for="input_6_postal" id="sublabel_postal"> Postcode </label></span>
              </td>
            </tr>
          </table>
        </div>
      </li>
      <li class="form-line" id="id_7">
        <label class="form-label-left" id="label_7" for="input_7"> Work </label>
        <div id="cid_7" class="form-input"><span class="form-sub-label-container"><input class="form-textbox" type="tel" name="phone_work" id="input_7_area" size="15" value="<?php echo $phone_work;?>"/>
            <label class="form-sub-label" for="input_7_phone" id="sublabel_phone"> Phone Number </label></span>
        </div>
      </li>
      <li class="form-line" id="id_8">
        <label class="form-label-left" id="label_8" for="input_8"> Mobile </label>
        <div id="cid_8" class="form-input"><span class="form-sub-label-container"><input class="form-textbox" type="tel" name="phone_mobile" id="input_8_area" size="15" value="<?php echo $phone_mobile;?>">
            <label class="form-sub-label" for="input_8_phone" id="sublabel_phone"> Phone Number </label></span>
        </div>
      </li>
      <li class="form-line" id="id_2">
        <div id="cid_2" class="form-input-wide">
          <div style="text-align:center" class="form-buttons-wrapper">
            <button id="input_2" type="submit" name="submit" class="form-submit-button">
              Submit
            </button>
          </div>
        </div>
      </li>
      <li style="display:none">
        Should be Empty:
        <input type="text" name="website" value="" />
      </li>
    </ul>
  </div>
</form></body>
</html>

<?php
  } else {

    /****
    *  Security check - has the UUID has been passed?
    ****/
    if (isset($_POST['u']) && $_POST['u'] != '') {
      $u = $_POST['u'];

      $first_name   = $_POST['first_name'];
      $last_name    = $_POST['last_name'];
      $address_1    = $_POST['address_1'];
      $address_2    = $_POST['address_2'];
      $address_3    = $_POST['address_3'];
      $address_4    = $_POST['address_4'];
      $postcode     = $_POST['postcode'];
      $phone_work   = $_POST['phone_work'];
      $phone_mobile = $_POST['phone_mobile'];

      /****
      *  Connect to DB
      ****/
      $db = mysqli_connect($db_hostname, $db_username, $db_password, $db_database);
      if (!$db) {
        die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
      }

      /****
      *  Unsubscribe query
      ****/
      $query  = "CALL p_form_update_details (";

      /****
      *  Add parameters to query
      ****/
      $status = 0;
      $string = 'empty';
      $count  = -1;
      $query .= "'".$u."',
                 '".$first_name."',
                 '".$last_name."',
                 '".$address_1."',
                 '".$address_2."',
                 '".$address_3."',
                 '".$address_4."',
                 '".$postcode."',
                 '".$phone_work."',
                 '".$phone_mobile."',
                @status,
                @string,
                @error,
                @error_code,
                @new_id,
                @count)";

      file_put_contents( "/tmp/update_details.txt", $query);

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
?>
<link type="text/css" rel="stylesheet" href="css/styles/form.css?v3.0.2332"/>
<link href="css/calendarview.css?v3.0.2332" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="css/styles/pastel.css" />
<style type="text/css">
    .form-label{
        width:150px !important;
    }
    .form-label-left{
        width:150px !important;
    }
    .form-line{
        padding:10px;
    }
    .form-label-right{
        width:150px !important;
    }
    .form-all{
        width:650px;
        background: repeat scroll 0% 0% rgb(207, 204, 200);
        color:rgb(82, 75, 58) !important;
        font-family:Tahoma;
        font-size:13px;
    }
</style>
<form class="jotform-form" >
  <input type="hidden" name="formID" value="20112031269" />
  <div class="form-all">
    <ul class="form-section">
      <li class="form-line" id="id_4">
        <div id="cid_4" class="form-input-wide">
          <div style="text-align:center;">
            <img alt="" class="form-image" border="0" src="http://indigo.com/images/datamine_logo.jpg" height="69" width="550" />
          </div>
        </div>
      </li>
      <li class="form-line" id="id_9">
        <div id="cid_9" class="form-input-wide">
          <div id="text_9" class="form-html">
            <p style="text-align: center;">
              <strong>
                Your details have been updated successfully. Thankyou.
                <br />
              </strong>
            </p>
          </div>
        </div>
      </li>
      <li style="display:none">
        Should be Empty:
        <input type="text" name="website" value="" />
      </li>
    </ul>
  </div>
</form>

<?php
    } else {

      /****
      *  Display error page
      ****/
?>
<link type="text/css" rel="stylesheet" href="css/styles/form.css?v3.0.2332"/>
<link href="css/calendarview.css?v3.0.2332" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="css/styles/pastel.css" />
<style type="text/css">
    .form-label{
        width:150px !important;
    }
    .form-label-left{
        width:150px !important;
    }
    .form-line{
        padding:10px;
    }
    .form-label-right{
        width:150px !important;
    }
    .form-all{
        width:650px;
        background: repeat scroll 0% 0% rgb(207, 204, 200);
        color:rgb(82, 75, 58) !important;
        font-family:Tahoma;
        font-size:13px;
    }
</style>
<form class="jotform-form" >
  <input type="hidden" name="formID" value="20112031269" />
  <div class="form-all">
    <ul class="form-section">
      <li class="form-line" id="id_4">
        <div id="cid_4" class="form-input-wide">
          <div style="text-align:center;">
            <img alt="" class="form-image" border="0" src="http://indigo.com/images/datamine_logo.jpg" height="69" width="550" />
          </div>
        </div>
      </li>
      <li class="form-line" id="id_9">
        <div id="cid_9" class="form-input-wide">
          <div id="text_9" class="form-html">
            <p style="text-align: center;">
              <strong>
                WARNING: you have clicked an invalid update details link!
                <br />
              </strong>
            </p>
          </div>
        </div>
      </li>
      <li style="display:none">
        Should be Empty:
        <input type="text" name="website" value="" />
      </li>
    </ul>
  </div>
</form>
<?php
    }
  }
?> 
