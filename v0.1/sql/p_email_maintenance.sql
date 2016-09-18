/*******************************************************************************
* Indigo                                                                       *
********************************************************************************
* Name          : p_email_maintenance.sql
* Description   : Indigo email maintenance
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Dec 12 | Initial issue                                     *
*******************************************************************************/
USE dev2;

DROP PROCEDURE IF EXISTS p_email_maintenance;
DELIMITER $$
CREATE PROCEDURE p_email_maintenance (
                   IN   p_action          VARCHAR(1),
                   IN   p_email_id        INT,
                   IN   p_email_name      VARCHAR(256),
                   IN   p_email_subject   VARCHAR(256),
                   IN   p_email_body      LONGTEXT,
                   IN   p_sender_name     VARCHAR(256),
                   IN   p_sender_address  VARCHAR(256),
                   IN   p_reply_to        VARCHAR(256),
                   IN   p_description     VARCHAR(1024),
                   IN   p_template_id     INT,
                   IN   p_test_address    VARCHAR(64),
                   OUT  p_status          CHAR(1),
                   OUT  p_string          LONGTEXT,
                   OUT  p_error           VARCHAR(512),
                   OUT  p_error_code      VARCHAR(512),
                   OUT  p_new_id          VARCHAR(16),
                   OUT  p_count           VARCHAR(16)
                 )
BEGIN

  /****
  *  Variables
  ****/
  DECLARE v_object         VARCHAR(32)    DEFAULT 'p_email_maintenance';
  DECLARE v_event          INT            DEFAULT 0;
  DECLARE v_query          VARCHAR(4096)  DEFAULT '';
  DECLARE v_dsql           VARCHAR(4096)  DEFAULT '';
  DECLARE v_sql            VARCHAR(4096)  DEFAULT '';
  DECLARE v_rows           INT            DEFAULT 0;
  DECLARE v_debug          VARCHAR(1024)  DEFAULT 'test';
  DECLARE v_sep            CHAR           DEFAULT '|';
  DECLARE v_segments       INT            DEFAULT 0; 
  DECLARE v_dummy          VARCHAR(64);
  DECLARE v_i              INT            DEFAULT 1;
  DECLARE v_run_id         INT            DEFAULT 1;
  DECLARE v_segment_id     VARCHAR(1024);
  DECLARE v_count          INT             DEFAULT 0;
  DECLARE v_done           BOOLEAN         DEFAULT FALSE;
  DECLARE v_db             VARCHAR(16);
  DECLARE v_column         VARCHAR(64);
  DECLARE v_position       INT;
  DECLARE v_columns        VARCHAR(1024)   DEFAULT '';
  DECLARE v_email_body     LONGTEXT;
DECLARE v1 LONGTEXT;
DECLARE v2 VARCHAR(64);
DECLARE v3 VARCHAR(64);
DECLARE v4 VARCHAR(64);
DECLARE v5 VARCHAR(64);

  DECLARE e_exception      INT            DEFAULT FALSE;

  DECLARE CONTINUE HANDLER FOR NOT FOUND          SET v_done      = TRUE;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN SET e_exception = TRUE; END;

  SET SQL_BIG_SELECTS = TRUE;

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
  *  Out parameter defaults
  ****/
  SET p_string := 'empty';
  SET p_status := '-1';
  SET p_count  := '-1';
  SET p_error  := 'OK';

  /****
  *  What are we doing to the email?
  ****/
  CASE p_action 
  WHEN 'I' THEN

    /****
    *  Get the next id if creating
    *
    *  we need to send the new id back to the browser
    *  but need to rethink this as > 1 person
    *  could be creating filters at the same time
    *  opt 1 - could lock the table until the proc finished
    *  opt 2 - select the id back out of the table using the name
    *  opt 3 - keep them in a table (could skip sequence though)
    ****/
    SELECT IFNULL(MAX(email_id + 1), 1)
    INTO   p_new_id
    FROM   emails;

    INSERT INTO emails (
      email_id,
      email_name,
      email_subject,
      email_body,
      sender_name,
      sender_address,
      reply_to,
      description,
      template_id
    ) VALUES (
      p_new_id,
      p_email_name,
      p_email_subject,
      p_email_body,
      p_sender_name,
      p_sender_address,
      p_reply_to,
      p_description,
      p_template_id
    );

    IF e_exception THEN
      SET p_error := CONCAT('Error creating email [',
                             p_email_name,
                             ']');
      SET p_error_code := '10';
    END IF;

  WHEN 'U' THEN

   UPDATE emails
   SET    email_name     = p_email_name,
          email_subject  = p_email_subject,
          email_body     = p_email_body,
          sender_name    = p_sender_name,
          sender_address = p_sender_address,
          reply_to       = p_reply_to,
          description    = p_description,
          template_id    = p_template_id
   WHERE  email_id       = p_email_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error updating email [',
                             p_email_name,
                             ']');
      SET p_error_code := '11';
    END IF;

  WHEN 'D' THEN

    UPDATE emails
    SET    deleted     = TRUE
    WHERE  email_id = p_email_id;

    IF e_exception THEN
      SET p_error := CONCAT('Error deleting email [',
                             p_email_name,
                             ']');
      SET p_error_code := '12';
    END IF;

  WHEN 'T' THEN

    /****
    *  Get the next id
    ****/
    SELECT IFNULL(MAX(email_id + 1), 1)
    INTO   p_new_id
    FROM   email_tests;

    /****
    *  Substitution variable management
    ****/
    SET @v_email_body := p_email_body;
    SET @p_error      := p_error;
    SET @p_error_code := p_error_code;

    CALL p_substitution (
           0,
           p_template_id,
           @v_email_body,
           @p_error,
           @p_error_code
         );

    SET v_email_body := @v_email_body;
    SET p_error      := @p_error;
    SET p_error_code := @p_error_code;


    INSERT INTO email_tests (
      email_id,
      email_name,
      email_subject,
      email_body,
      email_body_sub,
      sender_name,
      sender_address,
      reply_to,
      description,
      template_id, 
      test_address
    ) VALUES (
      p_new_id,
      p_email_name,
      p_email_subject,
      p_email_body,
      v_email_body,
      p_sender_name,
      p_sender_address,
      p_reply_to,
      p_description,
      p_template_id,
      p_test_address
    );

    IF e_exception THEN
      SET p_error := CONCAT('Error generating test email [',
                             p_email_name,
                             ']');
      SET p_error_code := '10';
    END IF;

    /****
    *  Send the substituted body back in p_string
    ****/
    SET p_string := v_email_body;

  WHEN 'V' THEN

    /****
    *  Get the next id
    ****/
    SELECT IFNULL(MAX(email_id + 1), 1)
    INTO   p_new_id
    FROM   email_views;

    /****
    *  Substitution variable management
    ****/
    SET @v_email_body := p_email_body;
    SET @p_error      := p_error;
    SET @p_error_code := p_error_code;

    CALL p_substitution (
           0,
           p_template_id,
           @v_email_body,
           @p_error,
           @p_error_code
         );

  SET v_email_body := @v_email_body;
  SET p_error      := @p_error;
  SET p_error_code := @p_error_code;

    INSERT INTO email_views (
      email_id,
      email_name,
      email_subject,
      email_body,
      email_body_sub,
      sender_name,
      sender_address,
      reply_to,
      template_id
    ) VALUES (
      p_new_id,
      p_email_name,
      p_email_subject,
      p_email_body,
      v_email_body,
      p_sender_name,
      p_sender_address,
      p_reply_to,
      p_template_id
    );

    IF e_exception THEN
      SET p_error := CONCAT('Error generating email view [',
                             p_new_id,
                             ']');
      SET p_error_code := '10';
    END IF;

    /****
    *  Send the substituted body back in p_string
    ****/
    SET p_string := v_email_body;

  ELSE

    SET p_error := 'Unknown action';

  END CASE;

END main;

ehandler:BEGIN

  CASE 
  WHEN e_exception = FALSE AND
       p_error     = 'OK'  THEN
 
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
           CONCAT('maintained email [', p_email_name, '] : action [', p_action, ']')
         );

    SET p_status := '1';
  ELSE

    /****
    *  Error message
    ****/
    SET p_error := CONCAT('MYSQL ERROR:[',
                           v_object,
                          ']:[', 
                           p_email_name, 
                           ']:action [', 
                           p_action,
                           ']:',
                           p_error);
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
    SET p_status := '0';
  END CASE;

END ehandler;
END;
$$
