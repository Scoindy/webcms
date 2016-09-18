/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_substitution.sql
* Description   : Replaces substitution variables with their values
* Author        : Scott Walkinshaw
* Date          : 7th November 2011
* Parameters    : 
* Comments      : 
*                 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 07 Nov 11 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_substitution;
DELIMITER $$
CREATE PROCEDURE p_substitution (
                   IN     p_contact_id   INTEGER,
                   IN     p_template_id  INTEGER,
                   INOUT  p_html         LONGTEXT,
                   INOUT  p_error        VARCHAR(512),
                   INOUT  p_error_code   VARCHAR(512)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_substitution';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sub_start      CHAR(5)        DEFAULT '[sub{';
  DECLARE v_sub_end        CHAR(2)        DEFAULT '}]';
  DECLARE v_subs           INT            DEFAULT 0; 
  DECLARE v_dummy          VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_value          VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;
  DECLARE v_done           BOOLEAN         DEFAULT FALSE;
  DECLARE v_db             VARCHAR(16);
  DECLARE v_column         VARCHAR(64);
  DECLARE v_html           LONGTEXT;
  DECLARE v_html_sub       LONGTEXT;
  DECLARE v_sub            VARCHAR(64);
  DECLARE v_sub_field      VARCHAR(64);
  DECLARE v_contact_id     INTEGER;
  DECLARE v_email_address  VARCHAR(128);
  DECLARE v_uuid           VARCHAR(64);

  DECLARE e_exception    INT            DEFAULT FALSE;

-- DECLARE p_error VARCHAR(63);
-- DECLARE p_error_code VARCHAR(63);

main:BEGIN

  /****
  *  Log entry
  ****/
  CALL p_event (
         v_object,
         1,
         v_event
       );

  /****
  *  If we're viewing an email from the
  *  email creation screen select a random contact
  ****/
  IF p_contact_id = 0 THEN
    SELECT contact_id,
           email_address,
           uuid
    INTO   v_contact_id,
           v_email_address,
           v_uuid
    FROM   contacts
    WHERE  email_permission = 'Y'
    AND    IFNULL(email_address, '') != ''
    ORDER BY 
           RAND() 
    LIMIT 1;

  ELSE

    SET v_contact_id := p_contact_id;

    /****
    *  If it's not a view grab the contact details
    *  contact details for the unsubscribe link
    ****/
    SELECT email_address,
           uuid
    INTO   v_email_address,
           v_uuid
    FROM   contacts
    WHERE  contact_id = p_contact_id;

  END IF;

  /****
  *  and add the unsubscribe data
  *  to the unsubscribe link if present
  SET p_html := REPLACE(p_html, 'unsubscribe.php', CONCAT('unsubscribe.php?u=', v_uuid));
  SET p_html := REPLACE(p_html, 'update_details.php', CONCAT('update_details.php?u=', v_uuid));


  *  all this stuff needs to be held in config tables
  *  if we were to run > 1 customer on the same server
  ****/
  SET p_html := REPLACE(p_html, 'update_details.php', CONCAT('http://indigo.com/forms/update_details.php?u=', v_uuid));
  SET p_html := REPLACE(p_html, 'unsubscribe.php', CONCAT('http://indigo.com/forms/unsubscribe.php?u=', v_uuid));

  SET p_html := REPLACE(p_html, 'images/', 'http://indigo.com/images/');



  /****
  *  How many substitution variables do we have?
  ****/
  SET v_html := p_html;
  SELECT (LENGTH(v_html) - LENGTH(REPLACE(v_html, v_sub_start, ''))) / 5
  INTO   v_subs;

  /****
  *  Separate the rule strings and build query
  ****/
  SET v_html := '';
  WHILE (v_i <= v_subs) DO
   
    /****
    *  Read string up to next substitution variable
    ****/
    SELECT CONCAT(v_html, SUBSTRING_INDEX(p_html, v_sub_start, 1))
    INTO   v_html;

    /****
    *  Get substitution variable
    ****/
    SELECT SUBSTRING(p_html, LOCATE(v_sub_start, p_html), (LOCATE(v_sub_end, p_html) - LOCATE(v_sub_start, p_html) + 2))
    INTO   v_sub;

    /****
    *  Get substitution field
    ****/
    SELECT SUBSTR(v_sub, (LOCATE('{', v_sub) + 1), (LOCATE('}', v_sub) - (LOCATE('{', v_sub)) - 1))
    INTO   v_sub_field;

    /****
    *  Dynamic SQL to get value
    ****/
    SET v_sql := CONCAT('SELECT `',
                         v_sub_field,
                        '` INTO @v_value FROM v_contacts_substitution WHERE contact_id = ',
                         v_contact_id);

    SET    @v_dsql := v_sql;
    PREPARE v_dsql FROM @v_dsql;
    EXECUTE v_dsql;
    SET v_value := NULL;
    SET v_value := @v_value;

    /****
    *  Get the default value if
    *  no actual value to substitute
    ****/
    IF IFNULL(v_value, '') = '' THEN
      SET v_sql := CONCAT('SELECT IFNULL(substitution_default, \'\') INTO ',
                          '@v_value FROM profile_fields WHERE field_label = \'',
                           v_sub_field,
                          '\'');

      SET    @v_dsql := v_sql;
      PREPARE v_dsql FROM @v_dsql;
      EXECUTE v_dsql;
      SET v_value := @v_value;
    END IF;

    /****
    *  Add the sub value to the HTML
    ****/
    SET v_html := CONCAT(v_html, v_value);

    /****
    *  Chop the parsed portion of the front of the original HTML
    ****/
    SELECT SUBSTRING(p_html, LOCATE(v_sub_end, p_html) + 2)
    INTO   p_html;

    SET v_i := v_i + 1;
  END WHILE;

  /****
  *  Add on the html between the last
  *  substitution field and the end of the html
  ****/
  SET p_html := CONCAT(v_html, IFNULL(p_html, ''));

  /****
  *  Finally - if we're not dealing with a template
  *  add <html> tags
  ****/
  IF p_template_id = 0 THEN
    SET p_html := CONCAT('<html><body bgcolor="white"><br>  ', p_html, '</body></html>');
  END IF;


END main;

ehandler:BEGIN

  CASE e_exception
  WHEN FALSE THEN

    /****
    *  Log success
    ****/
    CALL p_event (
           v_object,
           2,
           v_event
         );
    CALL p_log (
           v_event,
           CONCAT('substituted OK [', v_contact_id, ']')
         );

--    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                           ']:[',
                           v_contact_id,
                           ']');
    /****
    *  Log failure
    ****/
    CALL p_log (
           v_event,
           p_error
         );
    CALL p_event (
           v_object,
           3,
           v_event
         );
 --   SET p_status := '0';
  END CASE;

END ehandler;
END;
$$
