/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_create_user.sql
* Description   : Creates an Indigo user
* Author        : Scott Walkinshaw
* Date          : 7th February 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Feb 11 | Initial issue                                     *
*******************************************************************************/
USE dev1;

DROP PROCEDURE IF EXISTS p_create_user;
DELIMITER $$
CREATE PROCEDURE p_create_user (
                   IN  p_first_name  VARCHAR(32),
                   IN  p_last_name   VARCHAR(32),
                   IN  p_username    VARCHAR(32),
                   IN  p_password    VARCHAR(32)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_salt         VARCHAR(64)  DEFAULT 'abcde';

  DECLARE e_exception    INT          DEFAULT FALSE;
  DECLARE e_exception_s  VARCHAR(64)  DEFAULT 'OK';

main:BEGIN

  /****
  *  Log enter
  ****/

  SELECT 'here';



END main;

ehandler:BEGIN

END ehandler;



END;
$$
